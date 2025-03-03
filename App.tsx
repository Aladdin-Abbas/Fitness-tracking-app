import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { FitnessProvider } from './src/context/FitnessContext';
import { PaperProvider } from 'react-native-paper';
import { ErrorBoundary } from './src/shared/components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <PaperProvider>
        <FitnessProvider>
          <RootNavigator />
          <StatusBar style="auto" />
        </FitnessProvider>
      </PaperProvider>
    </ErrorBoundary>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
