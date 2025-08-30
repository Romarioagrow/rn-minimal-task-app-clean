import React,{useState,useEffect}from'react';
import{View,Text,StyleSheet,TouchableOpacity,LayoutAnimation,Animated,PanResponder}from'react-native';
import{colors,radius,spacing,font}from'../theme';
import CategoryPill from './CategoryPill';
import type{Task,Subtask,CategoryKey}from'../types';

interface Props{task:Task;onToggle:(id:string)=>void;onToggleSub:(taskId:string,subId:string)=>void;onDelete:(id:string)=>void;}

export default function TaskItem({task,onToggle,onToggleSub,onDelete}:Props){
  const[open,setOpen]=useState(Boolean(task.subtasks?.length));
  useEffect(()=>{if((task.subtasks?.length||0)>0&&!open){setOpen(true);}},[task.subtasks?.length]);
  const toggleOpen=()=>{LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);setOpen(v=>!v);} ;
  const repeatLabel=(r:Task['repeat'])=>r===null?'Нет':r==='daily'?'Ежедневно':r==='weekly'?'Еженедельно':'Ежемесячно';
  const progress=task.subtasks&&task.subtasks.length>0?task.subtasks.filter(s=>s.done).length/task.subtasks.length:0;
  const translateX=React.useRef(new Animated.Value(0)).current;
  const pan=React.useRef(PanResponder.create({
    onMoveShouldSetPanResponder:(_,g)=>Math.abs(g.dx)>8&&Math.abs(g.dy)<10,
    onPanResponderMove:(_,g)=>{ if(g.dx<0) translateX.setValue(g.dx); },
    onPanResponderRelease:(_,g)=>{
      if(g.dx<-100){
        Animated.timing(translateX,{toValue:-600,duration:180,useNativeDriver:true}).start(()=>onDelete(task.id));
      }else{
        Animated.spring(translateX,{toValue:0,useNativeDriver:true}).start();
      }
    }
  })).current;

  return (
    <View style={styles.swipeContainer}>
      <View style={styles.deleteBg}><Text style={styles.deleteText}>Удалить</Text></View>
      <Animated.View style={[styles.card,{transform:[{translateX}]}]} {...pan.panHandlers}>
             <View style={{flexDirection:'row',alignItems:'center',gap:spacing(1.5)}}>
         <TouchableOpacity onPress={()=>onToggle(task.id)} onLongPress={toggleOpen}>
           <View style={[styles.checkbox,task.done&&styles.checkboxOn]}/>
         </TouchableOpacity>
                                       <Text style={[styles.titleLarge,task.done&&styles.done,{flex:1,marginRight:spacing(0.5)}]}>{task.title||'(без названия)'}</Text>
       </View>

      <View style={{flexDirection:'row',gap:8,flexWrap:'wrap',marginBottom:spacing(1)}}>
        {task.categories.map((c:CategoryKey)=>(<CategoryPill key={c} category={c}/>))}
      </View>

             <View style={{flexDirection:'row',gap:spacing(1.5),flexWrap:'wrap',marginBottom:spacing(1)}}>
         {task.dueAt?(<View style={styles.metaRow}><Text style={styles.metaIcon}>🗓️</Text><Text style={styles.metaText}>{new Date(task.dueAt).toLocaleDateString()} , {new Date(task.dueAt).toLocaleTimeString().slice(0,5)}</Text></View>):null}
         {task.repeat?(<View style={styles.metaRow}><Text style={styles.metaIcon}>🔁</Text><Text style={styles.metaText}>Повтор {repeatLabel(task.repeat).toLowerCase()}</Text></View>):null}
         {typeof task.reminderMinutesBefore==='number'?(<View style={styles.metaRow}><Text style={styles.metaIcon}>🔔</Text><Text style={styles.metaText}>За {task.reminderMinutesBefore} мин</Text></View>):null}
         {task.priority?(<View style={styles.metaRow}><Text style={styles.metaIcon}>📌</Text><Text style={styles.metaText}>{task.priority==='high'?'Высокий':task.priority==='medium'?'Средний':'Низкий'} приоритет</Text></View>):null}
       </View>

             {task.notes?(<View style={{marginVertical:spacing(1)}}>
         <Text style={styles.sectionTitle}>Заметки</Text>
         <Text style={styles.notes}>{task.notes}</Text>
       </View>):null}

      {task.subtasks?.length?(<View style={{marginTop:spacing(1)}}>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
          <Text style={styles.sectionTitle}>Цели</Text>
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
      </Animated.View>
    </View>
  );
}

const styles=StyleSheet.create({
  swipeContainer:{marginBottom:spacing(1.5),position:'relative',borderRadius:radius.lg,overflow:'hidden'},
  deleteBg:{...StyleSheet.absoluteFillObject,backgroundColor:'#7f1d1d',justifyContent:'center',alignItems:'flex-end',paddingRight:spacing(2)},
  deleteText:{color:'#fff',fontWeight:'800'},
  card:{backgroundColor:colors.card,borderRadius:radius.lg,padding:spacing(1.5),borderWidth:1,borderColor:colors.border},
  header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:spacing(1)},
  row:{flexDirection:'row',alignItems:'center',gap:spacing(1.5)},
  checkbox:{width:20,height:20,borderRadius:10,borderWidth:2,borderColor:colors.border,backgroundColor:'transparent'},
  checkboxOn:{backgroundColor:colors.accent,borderColor:colors.accent},
  title:{color:colors.text,fontSize:font.title,fontWeight:'700'},
  done:{color:colors.subtext,textDecorationLine:'line-through'},
  time:{color:colors.subtext,fontSize:14,fontWeight:'400'},
  subs:{marginTop:spacing(1),paddingLeft:spacing(2)},
  subrow:{flexDirection:'row',alignItems:'center',gap:spacing(1),paddingVertical:6,paddingHorizontal:spacing(1),borderRadius:8},
  subDot:{width:16,height:16,borderRadius:8,borderWidth:2,borderColor:colors.border,backgroundColor:'transparent'},
  subDotOn:{backgroundColor:colors.accent,borderColor:colors.accent},
  subtext:{color:colors.text,fontSize:font.text,fontWeight:'400'},
  subdone:{textDecorationLine:'line-through',color:'#6b7280'},
  titleLarge:{color:colors.text,fontSize:22,fontWeight:'800',marginBottom:spacing(1)},
  metaRow:{flexDirection:'row',alignItems:'center',gap:6},
  metaIcon:{color:colors.subtext},
  metaText:{color:colors.subtext,fontSize:12,fontWeight:'700'},
  sectionTitle:{color:colors.text,fontSize:16,fontWeight:'800'},
  notes:{color:colors.subtext,fontWeight:'400'},
  progressWrap:{height:6,backgroundColor:'#2a2a2e',borderRadius:3,overflow:'hidden',marginTop:spacing(1)},
  progressFill:{height:6,backgroundColor:colors.accent},
  footerText:{color:colors.subtext,fontWeight:'400'}
})
