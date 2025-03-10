import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationService from '../shared/services/NotificationService';

type UserProfile = {
  firstName: string;
  lastName: string;
  height: string;
  weight: string;
  image: string | null;
};

type Activity = {
  id: number;
  date: string;
  type: string;
  duration: string;
  calories: number;
  steps: number;
};

type FitnessContextType = {
  activities: Activity[];
  dailySteps: number;
  dailyGoal: number;
  userProfile: UserProfile | null;
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  updateDailySteps: (steps: number) => void;
  updateDailyGoal: (goal: number) => void;
  updateUserProfile: (profile: UserProfile) => void;
  updateUserImage:(img:string) => void;
};

const FitnessContext = createContext<FitnessContextType | null>(null);

export const useFitness = () => {
  const context = useContext(FitnessContext);
  if (!context) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
};

export const FitnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [dailySteps, setDailySteps] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(10000);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadData();
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const storedProfile = await AsyncStorage.getItem('userProfile');
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadData = async () => {
    try {
      const storedActivities = await AsyncStorage.getItem('activities');
      const storedDailySteps = await AsyncStorage.getItem('dailySteps');
      const storedDailyGoal = await AsyncStorage.getItem('dailyGoal');

      if (storedActivities) setActivities(JSON.parse(storedActivities));
      if (storedDailySteps) setDailySteps(parseInt(storedDailySteps));
      if (storedDailyGoal) setDailyGoal(parseInt(storedDailyGoal));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const addActivity = async (activity: Omit<Activity, 'id'>) => {
    try {
      const newActivity = {
        ...activity,
        id: Date.now(),
      };
      const updatedActivities = [...activities, newActivity];
      setActivities(updatedActivities);
      await AsyncStorage.setItem('activities', JSON.stringify(updatedActivities));
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  const updateDailySteps = async (steps: number) => {
    try {
      setDailySteps(steps);
      await AsyncStorage.setItem('dailySteps', steps.toString());
    } catch (error) {
      console.error('Error updating daily steps:', error);
    }
  };

  const updateDailyGoal = async (goal: number) => {
    try {
      setDailyGoal(goal);
      await AsyncStorage.setItem('dailyGoal', goal.toString());
      // Schedule notification when goal is updated
      NotificationService.scheduleGoalNotification(goal);
    } catch (error) {
      console.error('Error updating daily goal:', error);
    }
  };

  const updateUserProfile = async (profile: UserProfile) => {
    try {
      setUserProfile(profile);
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const updateUserImage = async (img: string) => {
    try {
      setUserProfile((prevProfile) => ({...prevProfile,image:img} as UserProfile ));
      await AsyncStorage.setItem('userProfile', JSON.stringify({...userProfile,image:img}));
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  return (
    <FitnessContext.Provider
      value={{
        activities,
        dailySteps,
        dailyGoal,
        userProfile,
        addActivity,
        updateDailySteps,
        updateDailyGoal,
        updateUserProfile,
        updateUserImage
      }}
    >
      {children}
    </FitnessContext.Provider>
  );
};