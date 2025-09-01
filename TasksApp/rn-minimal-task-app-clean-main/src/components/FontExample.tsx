import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing } from '../theme';

export default function FontExample() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Тест Шрифтов</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inter Font Family</Text>
        <Text style={styles.interRegular}>Inter Regular - Обычный текст</Text>
        <Text style={styles.interMedium}>Inter Medium - Средний вес</Text>
        <Text style={styles.interSemiBold}>Inter SemiBold - Полужирный</Text>
        <Text style={styles.interBold}>Inter Bold - Жирный текст</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Poppins Font Family</Text>
        <Text style={styles.poppinsRegular}>Poppins Regular - Обычный текст</Text>
        <Text style={styles.poppinsMedium}>Poppins Medium - Средний вес</Text>
        <Text style={styles.poppinsSemiBold}>Poppins SemiBold - Полужирный</Text>
        <Text style={styles.poppinsBold}>Poppins Bold - Жирный текст</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Системные шрифты (для сравнения)</Text>
        <Text style={styles.systemRegular}>System Regular - Системный обычный</Text>
        <Text style={styles.systemBold}>System Bold - Системный жирный</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: spacing(2),
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: colors.text,
    marginBottom: spacing(3),
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing(3),
    padding: spacing(2),
    backgroundColor: colors.card,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: colors.accent,
    marginBottom: spacing(1),
  },
  // Inter fonts
  interRegular: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  interMedium: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  interSemiBold: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  interBold: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  // Poppins fonts
  poppinsRegular: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  poppinsMedium: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  poppinsSemiBold: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  poppinsBold: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  // System fonts
  systemRegular: {
    fontSize: 16,
    fontWeight: 'normal',
    color: colors.subtext,
    marginBottom: spacing(0.5),
  },
  systemBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.subtext,
    marginBottom: spacing(0.5),
  },
});
