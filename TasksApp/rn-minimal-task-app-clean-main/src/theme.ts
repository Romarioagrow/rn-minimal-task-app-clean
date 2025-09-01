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
  
  // Семейства шрифтов - используем Google Fonts
  family: {
    // Основной шрифт - Inter
    primary: 'Inter_400Regular',
    // Жирный шрифт - Inter Bold
    bold: 'Inter_700Bold',
    // Средний вес - Inter Medium
    medium: 'Inter_500Medium',
    // Полужирный - Inter SemiBold
    semibold: 'Inter_600SemiBold',
    // Альтернативный шрифт - Poppins
    secondary: 'Poppins_400Regular',
    // Жирный альтернативный - Poppins Bold
    secondaryBold: 'Poppins_700Bold',
    // Робото для технического текста
    mono: 'Roboto_400Regular',
    // Open Sans для заголовков
    display: 'OpenSans_700Bold'
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