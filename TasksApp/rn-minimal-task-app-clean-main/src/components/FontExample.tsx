import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, font } from '../theme';

export default function FontExample() {
  return (
    <View style={styles.container}>
      {/* Заголовок с Inter Bold */}
      <Text style={styles.mainTitle}>
        Красивые шрифты в приложении
      </Text>
      
      {/* Подзаголовок с Poppins */}
      <Text style={styles.subtitle}>
        Современный и элегантный дизайн
      </Text>
      
      {/* Основной текст с Inter */}
      <Text style={styles.bodyText}>
        Это пример использования красивых шрифтов Inter и Poppins в React Native приложении. 
        Inter отлично подходит для основного текста, а Poppins - для заголовков и акцентов.
      </Text>
      
      {/* Акцентный текст */}
      <Text style={styles.accentText}>
        ✨ Красивый и современный интерфейс
      </Text>
      
      {/* Метаданные */}
      <View style={styles.metaContainer}>
        <Text style={styles.metaText}>Inter Regular 400</Text>
        <Text style={styles.metaText}>Inter Medium 500</Text>
        <Text style={styles.metaText}>Inter SemiBold 600</Text>
        <Text style={styles.metaText}>Inter Bold 700</Text>
      </View>
      
      <View style={styles.metaContainer}>
        <Text style={styles.poppinsMeta}>Poppins Regular</Text>
        <Text style={styles.poppinsMeta}>Poppins Medium</Text>
        <Text style={styles.poppinsMeta}>Poppins SemiBold</Text>
        <Text style={styles.poppinsMeta}>Poppins Bold</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing(2),
    backgroundColor: colors.card,
    borderRadius: 12,
    margin: spacing(2),
  },
  mainTitle: {
    fontFamily: 'Inter',
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(1),
  },
  subtitle: {
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '600',
    color: colors.accent,
    marginBottom: spacing(2),
  },
  bodyText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
    lineHeight: 24,
    marginBottom: spacing(2),
  },
  accentText: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '500',
    color: colors.accent,
    marginBottom: spacing(2),
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(1),
    marginBottom: spacing(1),
  },
  metaText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    color: colors.subtext,
    backgroundColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  poppinsMeta: {
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '500',
    color: colors.subtext,
    backgroundColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});
