import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, SegmentedButtons, Card } from 'react-native-paper';
import { useFitness } from '../../../context/FitnessContext';
import { useStepCounter } from '../../../shared/hooks/useStepCounter';
import { ManualActivityEntry } from '../components/ManualActivityEntry';

type ActivityType = string;

export const ActivityScreen: React.FC = () => {
  const { addActivity, dailySteps, updateDailySteps } = useFitness();
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [activityType, setActivityType] = useState<ActivityType>('walking');
  const { steps, resetSteps } = useStepCounter(isActive);

  // Update daily steps only when activity is finished
  const updateTotalDailySteps = () => {
    updateDailySteps(dailySteps + steps);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0 && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds]);

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    setIsActive(!isActive);
    // No reset of steps when stopping, only toggle activity state
  };

  const handleReset = () => {
    setIsActive(false);
    setSeconds(0);
    resetSteps();
  };

  const calculateCalories = (seconds: number, type: string): number => {
    const minutes = seconds / 60;
    const caloriesPerMinute = {
      walking: 4,    // Average person burns ~4 calories per minute walking
      running: 11,   // Average person burns ~11 calories per minute running
      cycling: 7,    // Average person burns ~7 calories per minute cycling
    };
    return Math.floor(minutes * (caloriesPerMinute[type as keyof typeof caloriesPerMinute] || 4));
  };

  const handleFinish = () => {
    const calories = calculateCalories(seconds, activityType);

    addActivity({
      date: new Date().toISOString(),
      type: activityType,
      duration: formatTime(seconds),
      calories,
      steps,
    });

    updateTotalDailySteps();
    handleReset();
  };

  const handleValueChange = (value :string ) => {
    if(seconds > 0 ) return;
    setActivityType(value);
    console.log('Selected value:', value);
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Activity Tracker</Text>
      
      <Card style={styles.card}>
        <Card.Content >
          <Text variant="titleLarge" style={styles.timer}>{formatTime(seconds)}</Text>
          
          <SegmentedButtons
            value={activityType}
            onValueChange={handleValueChange}
            buttons={[
              { value: 'walking', label: 'Walking', icon:'walk', disabled: seconds > 0 },
              { value: 'running', label: 'Running', icon:'run', disabled: seconds > 0 },
              { value: 'cycling', label: 'Cycling', icon:'bike', disabled: seconds > 0 },
            ]}
            style={styles.segmentedButtons}
          />
          
          <View style={styles.statsContainer}>
            <Text variant="bodyLarge">Session Steps: {steps}</Text>
            <Text variant="bodyLarge">Calories: {calculateCalories(seconds, activityType)}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleStartStop}
              style={styles.button}
            >
              {isActive ? 'Stop' : 'Start'}
            </Button>
            <Button
              mode="outlined"
              onPress={handleReset}
              style={styles.button}
              disabled={seconds === 0}
            >
              Reset
            </Button>
            <Button
              mode="contained-tonal"
              onPress={handleFinish}
              style={styles.button}
              disabled={seconds === 0}
            >
              Finish
            </Button>
          </View>
        </Card.Content>
      </Card>

      <ManualActivityEntry />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    marginBottom: 16,
  },
  timer: {
    fontSize: 32,
    textAlign: 'center',
    paddingVertical:20
  },
  segmentedButtons: {
    marginBottom: 20,
  },
  statsContainer: {
    marginBottom: 20,
    gap: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  button: {
    flex: 1,
  },
});