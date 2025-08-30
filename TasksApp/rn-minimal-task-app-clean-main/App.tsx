import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TasksScreen from './src/screens/TasksScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style='light' />
      <TasksScreen />
    </SafeAreaProvider>
  );
}