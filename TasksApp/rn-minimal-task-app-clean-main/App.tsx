import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Inter_400Regular, Inter_700Bold, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Roboto_400Regular } from '@expo-google-fonts/roboto';
import { OpenSans_700Bold } from '@expo-google-fonts/open-sans';
import TasksScreen from './src/screens/TasksScreen';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
    Inter_500Medium,
    Inter_600SemiBold,
    Poppins_400Regular,
    Poppins_700Bold,
    Roboto_400Regular,
    OpenSans_700Bold,
  });

  // Если шрифты еще загружаются, показываем простой экран
  if (!fontsLoaded && !fontError) {
    return (
      <SafeAreaProvider>
        <StatusBar style='light' />
        <View style={styles.container}>
          <Text style={styles.loadingText}>Загрузка шрифтов...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  // Если есть ошибка загрузки шрифтов, логируем но продолжаем работу
  if (fontError) {
    console.warn('Ошибка загрузки Google Fonts:', fontError);
  }

  return (
    <SafeAreaProvider>
      <StatusBar style='light' />
      <TasksScreen />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0c',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'normal',
  },
});