import React,{useState,useEffect}from'react';
import{View,Text,StyleSheet,TouchableOpacity,LayoutAnimation,Animated,PanResponder}from'react-native';
import{colors,radius,spacing,font}from'../theme';
import CategoryPill from './CategoryPill';
import type{Task,Subtask,CategoryKey}from'../types';

interface Props{task:Task;onToggle:(id:string)=>void;onToggleSub:(taskId:string,subId:string)=>void;onDelete:(id:string)=>void;customCategories?:string[];onPress?:()=>void;}

export default function TaskItem({task,onToggle,onToggleSub,onDelete,customCategories=[],onPress}:Props){
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
                <TouchableOpacity onPress={() => {
                  if (onPress) onPress();
                }} style={{flex:1}} activeOpacity={0.7} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                   <View style={{flex:1}}>
            
            {/* Блок категорий */}
            {task.categories.length > 0 && (
              <View style={styles.categoriesTopBlock}>
                <View style={styles.categoriesContainer}>
                  {task.categories.map((c:CategoryKey)=>(<CategoryPill key={c} category={c} customCategories={customCategories}/>))}
                </View>
              </View>
            )}

                     {/* Заголовок задачи */}
             <View style={[
               styles.headerBlock,
               // Если только название и больше ничего нет, добавляем равные отступы
               (!task.subtasks?.length && !task.categories.length && !task.dueAt && !task.repeat && typeof task.reminderMinutesBefore !== 'number' && !task.priority && !task.notes) && styles.headerBlockAlone
             ]}>
               <View style={styles.titleRow}>
                                   <TouchableOpacity onPress={()=>{
                    onToggle(task.id);
                    if (!task.done && task.subtasks?.length) {
                      task.subtasks.forEach(subtask => {
                        if (!subtask.done) {
                          onToggleSub(task.id, subtask.id);
                        }
                      });
                    }
                  }} onLongPress={toggleOpen} style={{zIndex: 10, padding: 4}}>
                   <View style={[styles.checkbox,task.done&&styles.checkboxOn]}/>
                 </TouchableOpacity>
                 <View style={{flex:1, marginLeft:spacing(1.5)}}>
                   <Text style={[styles.titleLarge,task.done&&styles.done]}>
                     {task.title||'(без названия)'}
                   </Text>
                 </View>
               </View>
             </View>

                   {/* Блок целей */}
          {task.subtasks?.length > 0 && (
            <View style={styles.contentBlock}>
              <Text style={styles.blockTitle}>Цели</Text>
              <View style={styles.goalsContainer}>
                {task.subtasks.map((s:Subtask)=>(
                  <TouchableOpacity key={s.id} style={[styles.goalItem, {zIndex: 10}]} onPress={()=>{
                    onToggleSub(task.id,s.id);
                    const updatedSubtasks = task.subtasks.map(sub => 
                      sub.id === s.id ? { ...sub, done: !sub.done } : sub
                    );
                    const allDone = updatedSubtasks.every(sub => sub.done);
                    if (allDone && !task.done) {
                      onToggle(task.id);
                    }
                  }}>
                    <View style={[styles.goalDot,s.done&&styles.goalDotOn]}/>
                    <Text style={[styles.goalText,s.done&&styles.goalDone]}>{s.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.progressContainer}>
                <View style={styles.progressWrap}>
                  <View style={[styles.progressFill,{width:`${Math.round(progress*100)}%`}]} />
                </View>
              </View>
            </View>
          )}

        {/* Блок планирования */}
        {(task.dueAt || task.repeat || typeof task.reminderMinutesBefore === 'number' || task.priority) && (
          <View style={styles.contentBlock}>
            <Text style={styles.blockTitle}>Планирование</Text>
            <View style={styles.planningContainer}>
              {task.dueAt && (
                <View style={styles.planningItem}>
                  <Text style={styles.planningIcon}>🗓️</Text>
                  <Text style={styles.planningText}>
                    {new Date(task.dueAt).toLocaleDateString()} , {new Date(task.dueAt).toLocaleTimeString().slice(0,5)}
                  </Text>
                </View>
              )}
              {task.repeat && (
                <View style={styles.planningItem}>
                  <Text style={styles.planningIcon}>🔁</Text>
                  <Text style={styles.planningText}>Повтор {repeatLabel(task.repeat).toLowerCase()}</Text>
                </View>
              )}
              {typeof task.reminderMinutesBefore === 'number' && (
                <View style={styles.planningItem}>
                  <Text style={styles.planningIcon}>🔔</Text>
                  <Text style={styles.planningText}>За {task.reminderMinutesBefore} мин</Text>
                </View>
              )}
              {task.priority && (
                <View style={styles.planningItem}>
                  <Text style={styles.planningIcon}>📌</Text>
                  <Text style={styles.planningText}>
                    {task.priority === 'high' ? 'Высокий' : task.priority === 'medium' ? 'Средний' : 'Низкий'} приоритет
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Блок заметок */}
        {task.notes && (
          <View style={styles.contentBlock}>
            <Text style={styles.blockTitle}>Заметки</Text>
            <Text style={styles.notesText}>{task.notes}</Text>
          </View>
        )}

        {/* Разделитель */}
        <View style={styles.divider}/>
        
        {/* Футер */}
        <View style={styles.footerBlock}>
          {task.done ? (
            <>
              <Text style={styles.footerText}>
                Завершено {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : new Date().toLocaleDateString()}
              </Text>
              <Text style={styles.footerText}>
                {(() => {
                  const createdTime = new Date(task.createdAt).getTime();
                  const completedTime = task.completedAt ? new Date(task.completedAt).getTime() : new Date().getTime();
                  const durationMs = completedTime - createdTime;
                  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
                  const durationDays = Math.floor(durationHours / 24);
                  
                  if (durationDays > 0) {
                    return `Выполнено за ${durationDays} дн.`;
                  } else {
                    const durationMinutes = Math.floor(durationMs / (1000 * 60));
                    if (durationHours > 0) {
                      return `Выполнено за ${durationHours}ч ${durationMinutes % 60}м`;
                    } else {
                      return `Выполнено за ${durationMinutes}м`;
                    }
                  }
                })()}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.footerText}>
                Создано {new Date(task.createdAt).toLocaleDateString()}
              </Text>
              <Text style={styles.footerText}>
                {task.updatedAt ? `Обновлено ${new Date(task.updatedAt).toLocaleDateString()}` : ''}
              </Text>
            </>
          )}
        </View>
         </View>
         </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles=StyleSheet.create({
  // Контейнер для свайпа
  swipeContainer:{
    marginBottom:spacing(2),
    position:'relative',
    borderRadius:radius.lg,
    overflow:'hidden'
  },
  
  // Фон для удаления
  deleteBg:{
    ...StyleSheet.absoluteFillObject,
    backgroundColor:'#7f1d1d',
    justifyContent:'center',
    alignItems:'flex-end',
    paddingRight:spacing(2)
  },
  deleteText:{
    color:'#fff',
    fontFamily:'PTSansCaption-Bold'
  },
  
  // Основная карточка
  card:{
    backgroundColor:colors.card,
    borderRadius:radius.lg,
    padding:spacing(2),
    borderWidth:1,
    borderColor:colors.border
  },
  
  // Блок заголовка
  headerBlock:{
    marginBottom:spacing(1.75)
  },
  headerBlockAlone:{
    marginTop:spacing(1.75),
    marginBottom:spacing(1.75)
  },
  titleRow:{
    flexDirection:'row',
    alignItems:'center'
  },
  checkbox:{
    width:24,
    height:24,
    borderRadius:12,
    borderWidth:2,
    borderColor:colors.border,
    backgroundColor:'transparent'
  },
  checkboxOn:{
    backgroundColor:colors.accent,
    borderColor:colors.accent
  },
  titleLarge:{
    color:colors.text,
    fontSize:22,
    fontFamily:'PTSansCaption-Bold'
  },
  done:{
    color:colors.subtext,
    textDecorationLine:'line-through'
  },
  
  // Общие стили для контентных блоков
  contentBlock:{
    marginBottom:spacing(1.75)
  },
  blockTitle:{
    color:colors.text,
    fontSize:16,
    fontFamily:'PTSansCaption-Bold',
    marginBottom:spacing(1)
  },
  
  // Блок категорий
  categoriesTopBlock:{
    marginBottom:spacing(1.25)
  },
  categoriesContainer:{
    flexDirection:'row',
    gap:8,
    flexWrap:'wrap'
  },
  
  // Блок планирования
  planningContainer:{
    gap:spacing(0.75)
  },
  planningItem:{
    flexDirection:'row',
    alignItems:'center',
    gap:8
  },
  planningIcon:{
    color:colors.subtext,
    fontSize:16
  },
  planningText:{
    color:colors.subtext,
    fontSize:14,
    fontFamily:'PTSansCaption-Regular'
  },
  
  // Блок заметок
  notesText:{
    color:colors.subtext,
    fontSize:14,
    fontFamily:'PTSansCaption-Regular',
    lineHeight:20
  },
  
  // Блок целей
  goalsContainer:{
    gap:spacing(0.25),
    marginBottom:spacing(1)
  },
  goalItem:{
    flexDirection:'row',
    alignItems:'center',
    gap:spacing(1),
    paddingVertical:6,
    paddingHorizontal:spacing(1),
    borderRadius:8
  },
  goalDot:{
    width:16,
    height:16,
    borderRadius:8,
    borderWidth:2,
    borderColor:colors.border,
    backgroundColor:'transparent'
  },
  goalDotOn:{
    backgroundColor:colors.accent,
    borderColor:colors.accent
  },
  goalText:{
    color:colors.text,
    fontSize:14,
    fontFamily:'PTSansCaption-Regular',
    flex:1
  },
  goalDone:{
    textDecorationLine:'line-through',
    color:colors.subtext
  },
  progressContainer:{
    marginTop:spacing(1)
  },
  progressWrap:{
    height:6,
    backgroundColor:'#2a2a2e',
    borderRadius:3,
    overflow:'hidden'
  },
  progressFill:{
    height:6,
    backgroundColor:colors.accent
  },
  
  // Разделитель
  divider:{
    height:1,
    backgroundColor:colors.border,
    marginVertical:spacing(1.5)
  },
  
  // Футер
  footerBlock:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  footerText:{
    color:colors.subtext,
    fontSize:12,
    fontFamily:'PTSansCaption-Regular'
  }
})
