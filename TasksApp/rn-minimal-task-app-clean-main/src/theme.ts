import { Platform } from 'react-native';

export const colors = {
  bg: '#0b0b0c',
  card: '#151517',
  text: '#f5f5f7',
  subtext: '#a3a3aa',
  border: '#2a2a2e',
  accent: '#ffcc00',
  categories: {
    work: '#3b82f6',
    home: '#d9b300',
    global: '#ef4444',
    habit: '#60a5fa',
    personal: '#34d399',
    urgent: '#f97316'
  }
};

export const spacing = (n: number) => n * 8;

export const radius = {
  xl: 18,
  lg: 14,
  md: 10,
  sm: 8
};

export const font = {
  // Размеры шрифтов - уменьшены для более компактного вида
  title: 20,
  text: 14,
  small: 11,
  
  // Семейства шрифтов - используем системные шрифты
  family: {
    // Основной шрифт - системный без засечек
    primary: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    // Альтернативный шрифт - системный с засечками
    secondary: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
    // Моноширинный шрифт
    mono: Platform.OS === 'ios' ? 'SF Mono' : 'Roboto Mono'
  },
  
  // Веса шрифтов
  weight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800'
  }
};

// Простая конфигурация для системных шрифтов
export const fontConfig = {};