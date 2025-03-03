import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Text, Surface, IconButton } from 'react-native-paper';
 import { ActivityCardProps } from '../types';


export const ActivityCard: React.FC<ActivityCardProps> = ({
  id,
  type,
  duration,
  calories,
  time = '9:30 AM'
}) => {
  const dimensions = useWindowDimensions();

  return (
    <Surface
      key={id}
      style={[styles.activityCard, dimensions.width > dimensions.height && styles.landscapeActivityCard]}
      elevation={1}
    >
      <View style={styles.activityIcon}>
        <IconButton
          icon={type.toLowerCase() === 'running' ? 'run' : 'walk'}
          size={24}
          iconColor="#6200ee"
        />
      </View>
      <View style={styles.activityInfo}>
        <Text variant="titleMedium">{type}</Text>
        <Text variant="bodyMedium">{duration} · {calories} cal</Text>
      </View>
      <Text variant="bodySmall" style={styles.activityTime}>{time}</Text>
    </Surface>
  );
};

const styles = StyleSheet.create({
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  landscapeActivityCard: {
    flex: 1,
    marginHorizontal: 6,
  },
  activityIcon: {
    marginRight: 16,
  },
  activityInfo: {
    flex: 1,
  },
  activityTime: {
    color: '#666666',
  },
});