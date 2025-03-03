import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { DashboardCardProps } from '../types';

export const DashboardCard: React.FC<DashboardCardProps> = ({ dailySteps, dailyGoal, activities }) => {
  const dimensions = useWindowDimensions();

  // Calculate daily statistics
  const todayActivities = activities.filter(
    activity => new Date(activity.date).toDateString() === new Date().toDateString()
  );

  const dailyCalories = todayActivities.reduce((total, activity) => total + activity.calories, 0);
  
  // Calculate total active time in minutes and seconds
  const dailyActiveTime = todayActivities.reduce((total, activity) => {
    const [minutes, seconds] = activity.duration.split(':').map(Number);
    return total + minutes + (seconds / 60);
  }, 0);

  // Format active time to mm:ss
  const formatActiveTime = (timeInMinutes: number): string => {
    const minutes = Math.floor(timeInMinutes);
    const seconds = Math.round((timeInMinutes - minutes) * 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Estimate distance based on steps (average stride length 0.762m)
  const dailyDistance = (dailySteps * 0.762 / 1000).toFixed(1);

  return (
    <Surface style={[styles.progressCard, dimensions.width > dimensions.height && styles.landscapeProgressCard]} elevation={1}>
      <Text variant="headlineMedium">Dashboard</Text>
      <View style={[styles.progressContainer, dimensions.width > dimensions.height && styles.landscapeProgressContainer]}>
        <AnimatedCircularProgress
          size={dimensions.width > dimensions.height ? 150 : 200}
          width={15}
          fill={(dailySteps / dailyGoal) * 100}
          tintColor="#6200ee"
          backgroundColor="#e0e0e0"
        >
          {() => (
            <View style={styles.progressContent}>
              <Text variant="displayMedium">{dailySteps}</Text>
              <Text variant="bodyMedium">steps</Text>
            </View>
          )}
        </AnimatedCircularProgress>
        <View style={[styles.statsRow, dimensions.width > dimensions.height && styles.landscapeStatsRow]}>
          <View style={styles.statItem}>
            <Text variant="titleMedium">{dailyDistance}km</Text>
            <Text variant="bodySmall">Distance</Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="titleMedium">{dailyCalories}</Text>
            <Text variant="bodySmall">Calories</Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="titleMedium">{formatActiveTime(dailyActiveTime)}</Text>
            <Text variant="bodySmall">Active Time</Text>
          </View>
        </View>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  progressCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    marginBottom: 24,
  },
  landscapeProgressCard: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  progressContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  landscapeProgressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  progressContent: {
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  landscapeStatsRow: {
    marginTop: 0,
    width: '80%',
    marginLeft: 20,
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
});