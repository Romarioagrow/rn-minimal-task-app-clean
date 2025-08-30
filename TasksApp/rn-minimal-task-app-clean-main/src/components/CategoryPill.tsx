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

const styles=StyleSheet.create({
  pill:{paddingVertical:3,paddingHorizontal:spacing(1),borderRadius:radius.md,alignSelf:'flex-start',borderWidth:1},
  text:{fontSize:10,fontFamily:'PTSansCaption-Bold',letterSpacing:0.5}
});