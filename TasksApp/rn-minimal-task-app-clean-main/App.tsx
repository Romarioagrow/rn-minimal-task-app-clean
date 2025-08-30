import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import TasksScreen from './src/screens/TasksScreen';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'PTSansCaption-Regular': require('./assets/fonts/PTSansCaption-Regular.ttf'),
        'PTSansCaption-Bold': require('./assets/fonts/PTSansCaption-Bold.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // Показываем пустой экран пока шрифты загружаются
  }

  return (
    <SafeAreaProvider>
      <StatusBar style='light' />
      <TasksScreen />
    </SafeAreaProvider>
  );
}