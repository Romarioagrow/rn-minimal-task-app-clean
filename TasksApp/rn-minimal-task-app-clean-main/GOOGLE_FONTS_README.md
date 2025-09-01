# Google Fonts в React Native Expo проекте

## Установленные шрифты

В проекте установлены следующие Google Fonts:

### Inter
- `Inter_400Regular` - основной текст
- `Inter_500Medium` - средний вес
- `Inter_600SemiBold` - полужирный
- `Inter_700Bold` - жирный

### Poppins
- `Poppins_400Regular` - альтернативный текст
- `Poppins_500Medium` - средний вес
- `Poppins_600SemiBold` - полужирный
- `Poppins_700Bold` - жирный

### Roboto
- `Roboto_400Regular` - технический текст
- `Roboto_500Medium` - средний вес
- `Roboto_700Bold` - жирный

### Open Sans
- `OpenSans_400Regular` - заголовки
- `OpenSans_600SemiBold` - полужирный
- `OpenSans_700Bold` - жирный

## Использование

### 1. Импорт шрифтов
```typescript
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
```

### 2. Загрузка шрифтов
```typescript
const [fontsLoaded] = useFonts({
  Inter_400Regular,
  Inter_700Bold,
  Poppins_400Regular,
  Poppins_700Bold,
});
```

### 3. Ожидание загрузки
```typescript
if (!fontsLoaded) {
  return null; // или показать загрузочный экран
}
```

### 4. Применение в стилях
```typescript
const styles = StyleSheet.create({
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
  },
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
  },
});
```

## Структура в theme.ts

В файле `src/theme.ts` настроены следующие семейства шрифтов:

```typescript
export const font = {
  family: {
    primary: 'Inter_400Regular',      // Основной текст
    bold: 'Inter_700Bold',            // Жирный текст
    medium: 'Inter_500Medium',        // Средний вес
    semibold: 'Inter_600SemiBold',    // Полужирный
    secondary: 'Poppins_400Regular',  // Альтернативный
    secondaryBold: 'Poppins_700Bold', // Жирный альтернативный
    mono: 'Roboto_400Regular',        // Технический
    display: 'OpenSans_700Bold'       // Заголовки
  }
};
```

## Преимущества Google Fonts

1. **Высокое качество** - оптимизированные для веба шрифты
2. **Быстрая загрузка** - кэширование и оптимизация
3. **Большой выбор** - множество стилей и весов
4. **Кросс-платформенность** - одинаково выглядят на всех устройствах
5. **Простота использования** - готовые пакеты для Expo

## Добавление новых шрифтов

1. Установить пакет:
```bash
npm install @expo-google-fonts/[font-name]
```

2. Импортировать нужные веса:
```typescript
import { FontName_400Regular, FontName_700Bold } from '@expo-google-fonts/font-name';
```

3. Добавить в useFonts:
```typescript
const [fontsLoaded] = useFonts({
  FontName_400Regular,
  FontName_700Bold,
});
```

4. Использовать в стилях:
```typescript
fontFamily: 'FontName_700Bold'
```
