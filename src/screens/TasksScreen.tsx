import React,{useEffect,useMemo,useState}from'react';
import{View,Text,StyleSheet,FlatList,TouchableOpacity}from'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import{colors,spacing}from'../theme';
import TaskItem from'../components/TaskItem';
import type{Task,CategoryKey}from'../types';
import{loadTasks,saveTasks}from'../storage';

const defaultData:Task[]=[{id:'1',title:'Созвон',category:'work',dueAt:new Date().toISOString(),done:false,createdAt:new Date().toISOString()},{id:'2',title:'Корм животных',category:'home',done:false,createdAt:new Date().toISOString(),subtasks:[{id:'2a',title:'Кошка',done:false},{id:'2b',title:'Собака',done:false},{id:'2c',title:'Аквариум',done:false}]},{id:'3',title:'Позвонить в колледжи',category:'global',done:false,createdAt:new Date().toISOString()},{id:'4',title:'Замена колодок',category:'urgent',done:false,createdAt:new Date().toISOString(),subtasks:[{id:'4a',title:'Заказать колодки',done:false},{id:'4b',title:'Сервис 18:00',done:false}]}];

const filters:{key:'all'|CategoryKey,label:string}[]=[{key:'all',label:'Все'},{key:'work',label:'Работа'},{key:'home',label:'Дом'},{key:'global',label:'Глобальное'},{key:'habit',label:'Повтор'},{key:'personal',label:'Личное'},{key:'urgent',label:'Срочно'}];

export default function TasksScreen(){
const[tasks,setTasks]=useState<Task[]>([]);
const[filter,setFilter]=useState<'all'|CategoryKey>('all');

useEffect(()=>{(async()=>{const stored=await loadTasks();setTasks(stored.length?stored:defaultData);})();},[]);
useEffect(()=>{saveTasks(tasks);},[tasks]);

const list=useMemo(()=>tasks.filter(t=>filter==='all'?true:t.category===filter),[tasks,filter]);
const toggle=(id:string)=>setTasks(prev=>prev.map(t=>t.id===id?{...t,done:!t.done}:t));
const toggleSub=(taskId:string,subId:string)=>setTasks(prev=>prev.map(t=>{if(t.id!==taskId||!t.subtasks)return t;return{...t,subtasks:t.subtasks.map(s=>s.id===subId?{...s,done:!s.done}:s)}}));

return(
  <SafeAreaView style={styles.safe} edges={['top','left','right','bottom']}>
    <View style={styles.container}>
      <Text style={styles.h1}>Задачи</Text>
      <Text style={styles.caption}>Всего: {list.length} • Активных: {list.filter(t=>!t.done).length}</Text>
      <View style={styles.filters}>
        {filters.map(f=>(
          <TouchableOpacity key={f.key} style={[styles.fbtn,filter===f.key&&styles.fbtnOn]} onPress={()=>setFilter(f.key)}>
            <Text style={[styles.ftext,filter===f.key&&styles.ftextOn]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList data={list} keyExtractor={i=>i.id} renderItem={({item})=>(<TaskItem task={item} onToggle={toggle} onToggleSub={toggleSub}/>)} contentContainerStyle={{paddingBottom:spacing(10)}}/>
      <TouchableOpacity style={styles.fab} onPress={()=>{const t:Task={id:String(Date.now()),title:'Новая задача',category:'personal',done:false,createdAt:new Date().toISOString()};setTasks(prev=>[t,...prev]);}}>
        <Text style={styles.fabPlus}>＋</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);
}

const styles=StyleSheet.create({
safe:{flex:1,backgroundColor:colors.bg},
container:{flex:1,paddingHorizontal:spacing(2),paddingTop:spacing(1)},
h1:{color:'#ffffff',fontSize:34,fontWeight:'800'},
caption:{color:'#a3a3aa',marginBottom:spacing(1)},
filters:{flexDirection:'row',flexWrap:'wrap',gap:spacing(1),marginBottom:spacing(2)},
fbtn:{paddingHorizontal:spacing(1.5),paddingVertical:6,borderRadius:999,borderWidth:1,borderColor:'#2a2a2e'},
fbtnOn:{backgroundColor:'#1f2937'},
ftext:{color:'#a3a3aa'},
ftextOn:{color:'#ffffff',fontWeight:'700'},
fab:{position:'absolute',right:spacing(2),bottom:spacing(2),width:56,height:56,borderRadius:28,backgroundColor:'#ffcc00',alignItems:'center',justifyContent:'center'},
fabPlus:{fontSize:30,fontWeight:'700'}
});