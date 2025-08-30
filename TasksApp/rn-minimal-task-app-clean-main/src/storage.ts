import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Task } from './types';

const KEY='tasks_v2_multi_cat';
const CUSTOM_CATEGORIES_KEY='custom_categories';

export async function loadTasks():Promise<Task[]>{
  try{
    const raw=await AsyncStorage.getItem(KEY);
    if(!raw){return [];}
    const data=JSON.parse(raw) as Task[];
    return data.map(t=>({
      ...t,
      categories: Array.isArray((t as any).categories)?(t as any).categories: [(t as any).category||'personal']
    }));
  }catch{return[];}
}

export async function saveTasks(tasks:Task[]):Promise<void>{
  await AsyncStorage.setItem(KEY,JSON.stringify(tasks));
}

export async function loadCustomCategories(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(CUSTOM_CATEGORIES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export async function saveCustomCategories(categories: string[]): Promise<void> {
  await AsyncStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(categories));
}