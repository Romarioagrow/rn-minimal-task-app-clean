import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';
import type { CategoryKey } from '../types';

export default function CategoryPill({ category, customCategories = [] }:{ category: CategoryKey; customCategories?: string[] }){
  if(!category){
    return null as any;
  }
  
  const color=(colors.categories as any)[category]||colors.accent;
  
  const label:Record<CategoryKey,string>={
    work:'РАБОТА',
    home:'ДОМ',
    global:'ГЛОБАЛЬНОЕ',
    habit:'ПОВТОР',
    personal:'ЛИЧНОЕ',
    urgent:'СРОЧНО'
  };
  
  // Если это пользовательская категория, используем её название
  const displayText = customCategories.includes(category) ? category.toUpperCase() : label[category];
  
  return(
    <View style={[styles.pill,{backgroundColor:`${color}22`,borderColor:color}]}>
      <Text style={[styles.text,{color}]}>{displayText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start'
  },
  text:{fontSize:10,fontFamily:'Inter-Bold',letterSpacing:0.5}
});