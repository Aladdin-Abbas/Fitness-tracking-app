import React from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { useFitness } from '../../../context/FitnessContext';
import { DashboardCard } from '../components/DashboardCard';
import { ActivityCard } from '../components/ActivityCard';

export const HomeScreen = () => {
  const { dailySteps, dailyGoal, activities } = useFitness();
  const dimensions = useWindowDimensions();

  // Get the most recent activities (last 2)
  const recentActivities = activities
    .sort((a, b) => b.id - a.id)
    .slice(0, 2);

  return (
    <ScrollView style={styles.container}>
      <DashboardCard dailySteps={dailySteps} dailyGoal={dailyGoal} activities={activities} />

      <Text variant="titleLarge" style={styles.sectionTitle}>Recent Activities</Text>
      <View style={dimensions.width > dimensions.height ? styles.landscapeActivities : styles.portraitActivities}>
        {recentActivities.map((activity) => (
          <ActivityCard
            key={activity.id}
            id={activity.id}
            type={activity.type}
            duration={activity.duration}
            calories={activity.calories}
            date={activity.date}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  portraitActivities: {
    flexDirection: 'column',
  },
  landscapeActivities: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});