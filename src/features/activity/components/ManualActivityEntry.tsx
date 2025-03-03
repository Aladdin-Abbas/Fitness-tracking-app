import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, Card } from 'react-native-paper';
import { useFitness } from '../../../context/FitnessContext';

export const ManualActivityEntry: React.FC = () => {
  const { addActivity } = useFitness();
  const [activityType, setActivityType] = useState('');
  const [calories, setCalories] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = () => {
    if (!calories || !duration) return;

    addActivity({
      type: activityType,
      calories: parseInt(calories),
      duration: duration,
      date: new Date().toISOString(),
      steps: 0, // Manual entries don't track steps
    });

    // Reset form
    setCalories('');
    setDuration('');
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleLarge" style={styles.title}>Manual Activity Entry</Text>

        <TextInput
          label="Activity Type"
          value={activityType}
          onChangeText={setActivityType}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Calories Burned"
          value={calories}
          onChangeText={setCalories}
          keyboardType="numeric"
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Duration (mm:ss)"
          value={duration}
          onChangeText={setDuration}
          placeholder="00:00"
          style={styles.input}
          mode="outlined"
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          disabled={!calories || !duration}
        >
          Add Activity
        </Button>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  segmentedButtons: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
  },
});