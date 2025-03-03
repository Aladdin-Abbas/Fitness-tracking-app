# Fitness Tracking App

A comprehensive mobile application built with React Native for tracking fitness activities, managing daily goals, and monitoring health progress.

## Features

- Activity Tracking (Walking, Running, Cycling)
- Step Counter
- Calorie Tracking
- Daily/Weekly/Monthly Activity Summary
- Activity History with Calendar View
- Manual Activity Entry
- Data Export Functionality
- Responsive Design (Portrait & Landscape)

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Studio (for Android development)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Aladdin-Abbas/Fitness-tracking-app.git
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Run on your preferred platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your physical device

## Project Structure

```
src/
├── context/         # Global state management
├── features/        # Feature-based modules
│   ├── activity/    # Activity tracking
│   ├── history/     # Activity history
│   ├── home/        # Dashboard
│   └── profile/     # User profile
├── navigation/      # Navigation configuration
├── screens/         # Main screens
└── shared/         # Shared utilities and components
```

## Technologies Used

- React Native
- Expo
- React Native Paper (UI Components)
- React Navigation
- AsyncStorage (Local Storage)
- TypeScript

## Development

### Environment Setup

1. Install Expo CLI globally:
```bash
npm install -g expo-cli
```

2. For iOS development (Mac only):
- Install Xcode from the App Store
- Install Xcode Command Line Tools

3. For Android development:
- Install Android Studio
- Configure Android SDK
- Set up Android Virtual Device

### Running in Development

1. Start the development server:
```bash
npm start
```

2. Choose your platform:
- iOS: `npm run ios`
- Android: `npm run android`

