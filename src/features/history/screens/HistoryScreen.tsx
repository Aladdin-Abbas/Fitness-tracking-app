import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Share, useWindowDimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Card, Button, Searchbar, SegmentedButtons } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import { useFitness } from '../../../context/FitnessContext';
import { HistoryActivity, MarkedDates } from '../types';
import { exportToCSV } from '../../../shared/utils/exportToCSV';
import { ActivityList } from '../components/ActivityList';

type SummaryPeriod = 'daily' | 'weekly' | 'monthly';

export const HistoryScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [summaryPeriod, setSummaryPeriod] = useState<SummaryPeriod>('daily');
  const dimensions = useWindowDimensions();

  const { activities } = useFitness();

  const markedDates = activities.reduce((acc, activity) => {
    acc[activity.date] = { marked: true };
    return acc;
  }, {} as MarkedDates);

  const calculateSummary = useMemo(() => {
    const today = new Date();
    let filteredActivities = activities;

    if (summaryPeriod === 'daily') {
      const dayStart = new Date(today);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(today);
      dayEnd.setHours(23, 59, 59, 999);

      filteredActivities = activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate >= dayStart && activityDate <= dayEnd;
      });
    }
    else if (summaryPeriod === 'weekly') {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      filteredActivities = activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate >= weekStart && activityDate <= weekEnd;
      });
    } else if (summaryPeriod === 'monthly') {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      monthStart.setHours(0, 0, 0, 0);
      
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      monthEnd.setHours(23, 59, 59, 999);

      filteredActivities = activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate >= monthStart && activityDate <= monthEnd;
      });
    }

    return {
      totalSteps: filteredActivities.reduce((sum, activity) => sum + activity.steps, 0),
      totalCalories: filteredActivities.reduce((sum, activity) => sum + activity.calories, 0),
      totalActivities: filteredActivities.length,
      averageSteps: Math.round(filteredActivities.reduce((sum, activity) => sum + activity.steps, 0) / (filteredActivities.length || 1)),
    };
  }, [activities, summaryPeriod]);

  const handleSearch = useCallback((text: string) => {
    if (searchQuery !== text) {
      setDebouncedQuery(text);
      const timeoutId = setTimeout(() => {
        setSearchQuery(text);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery]);

  
  const filteredActivities = useMemo(() => 
    activities.filter(activity => {
      if (!selectedDate && !searchQuery) return true;
      
      const activityDate = new Date(activity.date).toISOString().split('T')[0];
      const dateMatch = !selectedDate || activityDate === selectedDate;
      const searchMatch = !searchQuery || 
        activity.type.toLowerCase().includes(searchQuery.toLowerCase());
      
      return dateMatch && searchMatch;
    }),
    [activities, selectedDate, searchQuery]
  );

  const handleExport = async () => {
    try {
      await exportToCSV(filteredActivities);
    } catch (error) {
      console.error('Error exporting activities:', error);
    }
  };

  return (
    <KeyboardAvoidingView 
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={styles.container}>
      <View style={dimensions.width > dimensions.height ? styles.landscapeLayout : styles.portraitLayout}>

        <ScrollView style={dimensions.width > dimensions.height ? styles.calendarContainer : styles.fullWidth}>
          <Card style={styles.summaryCard}>
            <Card.Content>
              <SegmentedButtons
                value={summaryPeriod}
                onValueChange={value => setSummaryPeriod(value as SummaryPeriod)}
                buttons={[
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'monthly', label: 'Monthly' },
                ]}
                style={styles.segmentedButtons}
              />
              <View style={styles.summaryContent}>
                <Text variant="titleMedium">{summaryPeriod.charAt(0).toUpperCase() + summaryPeriod.slice(1)} Summary</Text>
                <Text variant="bodyMedium">Total Steps: {calculateSummary.totalSteps}</Text>
                <Text variant="bodyMedium">Total Calories: {calculateSummary.totalCalories}</Text>
                <Text variant="bodyMedium">Activities: {calculateSummary.totalActivities}</Text>
                <Text variant="bodyMedium">Average Steps: {calculateSummary.averageSteps}</Text>
              </View>
            </Card.Content>
          </Card>

          <Calendar
            onDayPress={(day: { dateString: React.SetStateAction<string>; }) => {
              setSelectedDate(day.dateString === selectedDate ? '' : day.dateString);
            }}
            markedDates={{
              ...markedDates,
              [selectedDate]: { selected: true, marked: markedDates[selectedDate]?.marked }
            }}
            theme={{
              selectedDayBackgroundColor: '#6200ee',
              dotColor: '#6200ee'
            }}
          />

          <View style={styles.filterContainer}>
            <Searchbar
              placeholder="Search activities"
              onChangeText={handleSearch}
              value={debouncedQuery}
              style={styles.searchbar}
            />
            <Button
              mode="contained-tonal"
              onPress={handleExport}
              style={styles.exportButton}
            >
              Export
            </Button>
          </View>
        </ScrollView>

           <View style={[
        styles.activitiesListContainer,
        dimensions.width > dimensions.height ? styles.activitiesContainerLandscape : styles.activitiesContainerPortrait
      ]}>
          <ActivityList filteredActivities={filteredActivities} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  portraitLayout: {
    flexDirection: 'column',
  },
  landscapeLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchbar: {
    flex: 1,
    marginRight: 8,
  },
  exportButton: {
    marginLeft: 8,
  },
  card: {
    marginBottom: 12,
  },
  landscapeCard: {
    marginLeft: 8,
  },
  summaryCard: {
    marginBottom: 16,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  summaryContent: {
    gap: 8,
  },
  listContainer: {
    height: '100%', 
  },
  activitiesListContainer: {
    flex: 1,
    minHeight: 300, 

  },
  activitiesContainerPortrait: {
    marginTop: 16,
    height: '40%',

  },
  activitiesContainerLandscape: {
    flex:1,
    // width:200,
    // backgroundColor:"red"
  },
  calendarContainer: {
    // flex: 1,
    width:"50%",
    marginBottom:80,
  },
  fullWidth: {
    width: '100%',
  }
});