import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList } from './types';
import { SplashScreen } from '../screens/SplashScreen';
import { UserDataScreen } from '../screens/UserDataScreen';
import { HomeScreen } from '../features/home/screens/HomeScreen';
import { ActivityScreen } from '../features/activity';
import { HistoryScreen } from '../features/history/screens/HistoryScreen';
import { ProfileScreen } from '../features/profile/ProfileScreen';
import { IconButton } from 'react-native-paper';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} options={{tabBarIcon:({color,size}) =>  <IconButton
          icon="home"
          size={size}
          iconColor={color}
        />}} />
      <Tab.Screen name="Activity" component={ActivityScreen} options={{tabBarIcon:({color,size}) =>  <IconButton
          icon="pulse"
          size={size}
          iconColor={color}
        />}} />
      <Tab.Screen name="History" component={HistoryScreen} options={{tabBarIcon:({color,size}) =>  <IconButton
          icon="history"
          size={size}
          iconColor={color}
        />}} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{tabBarIcon:({color,size}) =>  <IconButton
          icon="account"
          size={size}
          iconColor={color}
        />}} />
    </Tab.Navigator>
  );
};

export const RootNavigator = () => { 
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="UserData" component={UserDataScreen} />
        <Stack.Screen name="Main" component={MainNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};