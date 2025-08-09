import React,{useState,useEffect}from'react';
import{View,Text,StyleSheet,TouchableOpacity,LayoutAnimation}from'react-native';
import{colors,radius,spacing,font}from'../theme';
import CategoryPill from './CategoryPill';
import type{Task,Subtask,CategoryKey}from'../types';

interface Props{task:Task;onToggle:(id:string)=>void;onToggleSub:(taskId:string,subId:string)=>void;}

export default function TaskItem({task,onToggle,onToggleSub}:Props){
  const[open,setOpen]=useState(Boolean(task.subtasks?.length));
  useEffect(()=>{if((task.subtasks?.length||0)>0&&!open){setOpen(true);}},[task.subtasks?.length]);
  const toggleOpen=()=>{LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);setOpen(v=>!v);} ;
  const repeatLabel=(r:Task['repeat'])=>r===null?'Нет':r==='daily'?'Ежедневно':r==='weekly'?'Еженедельно':'Ежемесячно';
  const progress=task.subtasks&&task.subtasks.length>0?task.subtasks.filter(s=>s.done).length/task.subtasks.length:0;

  return (
    <View style={styles.card}>
      <View style={{flexDirection:'row',alignItems:'center',gap:spacing(1.5)}}>
        <TouchableOpacity onPress={()=>onToggle(task.id)} onLongPress={toggleOpen}>
          <View style={[styles.checkbox,task.done&&styles.checkboxOn]}/>
        </TouchableOpacity>
        <Text style={[styles.titleLarge,task.done&&styles.done]}>{task.title||'(без названия)'}</Text>
      </View>

      <View style={{flexDirection:'row',gap:8,flexWrap:'wrap',marginBottom:spacing(1)}}>
        {task.categories.map((c:CategoryKey)=>(<CategoryPill key={c} category={c}/>))}
      </View>

      <View style={{flexDirection:'row',gap:spacing(3),flexWrap:'wrap',marginBottom:spacing(1)}}>
        {task.dueAt?(<View style={styles.metaRow}><Text style={styles.metaIcon}>🗓️</Text><Text style={styles.metaText}>{new Date(task.dueAt).toLocaleDateString()} , {new Date(task.dueAt).toLocaleTimeString().slice(0,5)}</Text></View>):null}
        {task.repeat?(<View style={styles.metaRow}><Text style={styles.metaIcon}>🔁</Text><Text style={styles.metaText}>Повтор {repeatLabel(task.repeat).toLowerCase()}</Text></View>):null}
        {typeof task.reminderMinutesBefore==='number'?(<View style={styles.metaRow}><Text style={styles.metaIcon}>🔔</Text><Text style={styles.metaText}>За {task.reminderMinutesBefore} мин</Text></View>):null}
        {task.priority?(<View style={styles.metaRow}><Text style={styles.metaIcon}>📌</Text><Text style={styles.metaText}>{task.priority==='high'?'Высокий':task.priority==='medium'?'Средний':'Низкий'} приоритет</Text></View>):null}
      </View>

      {task.notes?(<View style={{marginVertical:spacing(1)}}>
        <Text style={styles.sectionTitle}>Заметки</Text>
        <Text style={styles.notes} numberOfLines={2}>{task.notes}</Text>
      </View>):null}

      {task.subtasks?.length?(<View style={{marginTop:spacing(1)}}>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
          <Text style={styles.sectionTitle}>Подзадачи</Text>
        </View>
        <View style={{marginTop:spacing(1)}}>
          {task.subtasks.map((s:Subtask)=>(
            <TouchableOpacity key={s.id} style={styles.subrow} onPress={()=>onToggleSub(task.id,s.id)}>
              <View style={[styles.subDot,s.done&&styles.subDotOn]}/>
              <Text style={[styles.subtext,s.done&&styles.subdone]}>{s.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.progressWrap}><View style={[styles.progressFill,{width:`${Math.round(progress*100)}%`}]} /></View>
      </View>):null}

      <View style={{height:1,backgroundColor:colors.border,marginVertical:spacing(1)}}/>
      <Text style={styles.footerText}>Создано {new Date(task.createdAt).toLocaleDateString()} {task.updatedAt?` · Обновлено ${new Date(task.updatedAt).toLocaleDateString()}`:''}</Text>
    </View>
  );
}

const styles=StyleSheet.create({
  card:{backgroundColor:colors.card,borderRadius:radius.xl,padding:spacing(2),marginBottom:spacing(2),borderWidth:1,borderColor:colors.border},
  header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:spacing(1)},
  row:{flexDirection:'row',alignItems:'center',gap:spacing(1.5)},
  checkbox:{width:24,height:24,borderRadius:12,borderWidth:2,borderColor:colors.border,backgroundColor:'transparent'},
  checkboxOn:{backgroundColor:colors.accent,borderColor:colors.accent},
  title:{color:colors.text,fontSize:font.title,fontWeight:'700'},
  done:{color:colors.subtext,textDecorationLine:'line-through'},
  time:{color:colors.subtext,fontSize:14},
  subs:{marginTop:spacing(1.5),paddingLeft:spacing(3)},
  subrow:{flexDirection:'row',alignItems:'center',gap:spacing(1),paddingVertical:8,paddingHorizontal:spacing(1),borderRadius:12,borderWidth:1,borderColor:colors.border},
  subDot:{width:18,height:18,borderRadius:9,borderWidth:2,borderColor:colors.border,backgroundColor:'transparent'},
  subDotOn:{backgroundColor:colors.accent,borderColor:colors.accent},
  subtext:{color:colors.text,fontSize:font.text},
  subdone:{textDecorationLine:'line-through',color:'#6b7280'},
  titleLarge:{color:colors.text,fontSize:28,fontWeight:'800',marginBottom:spacing(1)},
  metaRow:{flexDirection:'row',alignItems:'center',gap:8},
  metaIcon:{color:colors.subtext},
  metaText:{color:colors.subtext,fontSize:16,fontWeight:'700'},
  sectionTitle:{color:colors.text,fontSize:20,fontWeight:'800'},
  notes:{color:colors.subtext},
  progressWrap:{height:8,backgroundColor:'#2a2a2e',borderRadius:4,overflow:'hidden',marginTop:spacing(1)},
  progressFill:{height:8,backgroundColor:colors.accent},
  footerText:{color:colors.subtext}
})
