import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import { Platform } from 'react-native';

class NotificationService {
  private isConfigured: boolean = false;

  constructor() {
    this.configure().catch(error => {
      console.error('Failed to configure notifications:', error);
    });
  }

  configure = async () => {
    try {
      // Request permission for notifications (required for iOS)
      if (Platform.OS === 'ios') {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          throw new Error('Permission not granted for notifications');
        }
      }

      // Configure notification settings
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });

      // Configure Android channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('fitness-goals', {
          name: 'Fitness Goals',
          description: 'Notifications for daily fitness goals',
          importance: Notifications.AndroidImportance.HIGH,
          sound: 'default',
          vibrationPattern: [0, 250, 250, 250],
          enableVibrate: true,
        });
      }

      this.isConfigured = true;
    } catch (error) {
      console.error('Error configuring notifications:', error);
      throw error;
    }
  };

  scheduleGoalNotification = async (dailyGoal: number, hour: number = 20, minute: number = 0) => {
    try {
      if (!this.isConfigured) {
        await this.configure();
      }

      // Cancel any existing notifications
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Schedule new notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Daily Fitness Goal Reminder',
          body: `Don't forget to reach your daily goal of ${dailyGoal} steps!`,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          ...(Platform.OS === 'android' ? { channelId: 'fitness-goals' } : {}),
        },
        trigger: {
          hour: hour,
          minute: minute,
          type: SchedulableTriggerInputTypes.DAILY,
          channelId: 'fitness-goals' 
        },
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  };
}

export default new NotificationService();