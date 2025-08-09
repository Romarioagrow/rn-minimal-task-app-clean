import React,{useEffect,useMemo,useState,useCallback}from'react';
import{View,Text,StyleSheet,FlatList,TouchableOpacity,TextInput,KeyboardAvoidingView,Platform,ScrollView}from'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import{colors,spacing}from'../theme';
import TaskItem from'../components/TaskItem';
import type{Task,CategoryKey}from'../types';
import{loadTasks,saveTasks}from'../storage';

const defaultData:Task[]=[
  {id:'1',title:'Созвон',categories:['work'],dueAt:new Date().toISOString(),done:false,createdAt:new Date().toISOString()},
  {id:'2',title:'Корм животных',categories:['home'],done:false,createdAt:new Date().toISOString(),subtasks:[{id:'2a',title:'Кошка',done:false},{id:'2b',title:'Собака',done:false},{id:'2c',title:'Аквариум',done:false}]},
  {id:'3',title:'Позвонить в колледжи',categories:['global'],done:false,createdAt:new Date().toISOString()},
  {id:'4',title:'Замена колодок',categories:['urgent'],done:false,createdAt:new Date().toISOString(),subtasks:[{id:'4a',title:'Заказать колодки',done:false},{id:'4b',title:'Сервис 18:00',done:false}]}
];

const LABELS:Record<CategoryKey,string>={work:'Работа',home:'Дом',global:'Глобальное',habit:'Повтор',personal:'Личное',urgent:'Срочно'};

export default function TasksScreen(){
const[tasks,setTasks]=useState<Task[]>([]);
const[editorOpen,setEditorOpen]=useState(false);
const[editingTaskId,setEditingTaskId]=useState<string|null>(null);
const[draftTask,setDraftTask]=useState<Task|null>(null);
const[filter,setFilter]=useState<'all'|CategoryKey>('all');

useEffect(()=>{(async()=>{const stored=await loadTasks();setTasks(stored.length?stored:defaultData);})();},[]);
useEffect(()=>{saveTasks(tasks);},[tasks]);

const list=useMemo(()=>tasks.filter(t=>filter==='all'?true:t.categories.includes(filter)),[tasks,filter]);
const toggle=useCallback((id:string)=>{
  setTasks(prev=>prev.map(t=>t.id===id?{...t,done:!t.done,updatedAt:new Date().toISOString()}:t));
},[]);
const toggleSub=useCallback((taskId:string,subId:string)=>{
  setTasks(prev=>prev.map(t=>{
    if(t.id!==taskId||!t.subtasks) return t;
    return {
      ...t,
      updatedAt:new Date().toISOString(),
      subtasks:t.subtasks.map(s=>s.id===subId?{...s,done:!s.done}:s)
    };
  }));
},[]);
const handleDelete=useCallback((id:string)=>{
  setTasks(prev=>prev.filter(t=>t.id!==id));
},[]);
const renderItem=useCallback(({item}:{item:Task})=> (
  <TaskItem task={item} onToggle={toggle} onToggleSub={toggleSub} onDelete={handleDelete}/>
),[toggle,toggleSub]);

return(
  <SafeAreaView style={styles.safe} edges={['top','left','right','bottom']}>
    <View style={styles.container}>
      <Text style={styles.h1}>Задачи</Text>
      <Text style={styles.caption}>Всего: {list.length} • Активных: {list.filter(t=>!t.done).length}</Text>
      <View style={styles.filters}>
        <TouchableOpacity key={'all'} style={[styles.fbtn,filter==='all'&&styles.fbtnOn]} onPress={()=>setFilter('all')}>
          <Text style={[styles.ftext,filter==='all'&&styles.ftextOn]}>Все</Text>
        </TouchableOpacity>
        {Array.from(new Set(tasks.flatMap(t=>t.categories))).map((c)=> (
          <TouchableOpacity key={c} style={[styles.fbtn,filter===c&&styles.fbtnOn]} onPress={()=>setFilter(c as CategoryKey)}>
            <Text style={[styles.ftext,filter===c&&styles.ftextOn]}>{LABELS[c as CategoryKey]||String(c)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={list}
        keyExtractor={i=>i.id}
        renderItem={renderItem}
        contentContainerStyle={{paddingBottom:spacing(12)}}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={7}
        removeClippedSubviews
      />
      <TouchableOpacity style={styles.fab} onPress={()=>{
        // Открываем редактор с черновиком без категорий по умолчанию
        const draft:Task={
          id:String(Date.now()),
          title:'',
          categories:[],
          done:false,
          createdAt:new Date().toISOString(),
          subtasks:[]
        };
        setDraftTask(draft);
        setEditingTaskId(null);
        setEditorOpen(true);
      }}>
        <Text style={styles.fabPlus}>＋</Text>
      </TouchableOpacity>
      {editorOpen?(
        <TaskEditor
          task={(editingTaskId?tasks.find(t=>t.id===editingTaskId):draftTask)!}
          onClose={()=>{setEditorOpen(false); setEditingTaskId(null); setDraftTask(null);}}
          onSave={(updated)=>{
            setTasks(prev=>{
              const exists=prev.some(t=>t.id===updated.id);
              return exists?prev.map(t=>t.id===updated.id?updated:t):[updated,...prev];
            });
            setEditorOpen(false); setEditingTaskId(null); setDraftTask(null);
          }}
          onDelete={()=>{
            if(editingTaskId){
              setTasks(prev=>prev.filter(t=>t.id!==editingTaskId));
            }
            setEditorOpen(false); setEditingTaskId(null); setDraftTask(null);
          }}
        />
      ):null}
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

// Редактор задачи — простая модалка без сторонних библиотек
function TaskEditor({task,onClose,onSave,onDelete}:{task:Task;onClose:()=>void;onSave:(t:Task)=>void;onDelete:()=>void}){
  const [title,setTitle]=useState(task.title);
  const [notes,setNotes]=useState(task.notes||'');
  const [categories,setCategories]=useState<CategoryKey[]>(task.categories);
  const [repeat,setRepeat]=useState<Task['repeat']>(task.repeat??null);
  const [dueOpen,setDueOpen]=useState(false);
  const [remindOpen,setRemindOpen]=useState(false);
  const [priorityOpen,setPriorityOpen]=useState(false);
  const [dueDate,setDueDate]=useState<string>(task.dueAt?new Date(task.dueAt).toISOString().slice(0,10):'');
  const [dueTime,setDueTime]=useState<string>(task.dueAt?new Date(task.dueAt).toTimeString().slice(0,5):'');
  const [reminder,setReminder]=useState<number|undefined>(task.reminderMinutesBefore);
  const [priority,setPriority]=useState<Task['priority']>(task.priority??null);
  const [subtasks,setSubtasks]=useState(task.subtasks||[]);
  const [repeatOpen,setRepeatOpen]=useState(false);

  const CATEGORY_LABELS:Record<CategoryKey,string>={work:'Работа',home:'Дом',global:'Глобальное',habit:'Повтор',personal:'Личное',urgent:'Срочно'};
  const toggleCategory=(c:CategoryKey)=>setCategories(prev=>prev.includes(c)?prev.filter(x=>x!==c):[...prev,c]);
  const addSub=()=>setSubtasks(prev=>[...prev,{id:String(Date.now()),title:'',done:false}]);
  const updateSub=(id:string,title:string)=>setSubtasks(prev=>prev.map(s=>s.id===id?{...s,title}:s));
  const removeSub=(id:string)=>setSubtasks(prev=>prev.filter(s=>s.id!==id));

  const cycleRepeat=()=>{
    const order:[Task['repeat'],Task['repeat'],Task['repeat'],Task['repeat']]=[null,'daily','weekly','monthly'];
    const idx=order.indexOf(repeat??null);
    setRepeat(order[(idx+1)%order.length]);
  };

  const repeatLabel=(r:Task['repeat'])=>r===null?'Нет':r==='daily'?'Ежедневно':r==='weekly'?'Еженедельно':'Ежемесячно';
  const formatDateTime=(dateStr:string,timeStr:string)=>{
    if(!dateStr||!timeStr) return 'Не задано';
    try{
      const d=new Date(`${dateStr}T${timeStr}:00`);
      const now=new Date();
      const isToday=d.toDateString()===now.toDateString();
      const tomorrow=new Date(now); tomorrow.setDate(now.getDate()+1);
      const isTomorrow=d.toDateString()===tomorrow.toDateString();
      const time=timeStr;
      if(isToday) return `Сегодня, ${time}`;
      if(isTomorrow) return `Завтра, ${time}`;
      return `${d.toLocaleDateString()}, ${time}`;
    }catch{ return 'Не задано'; }
  };

  return (
    <View style={editorStyles.backdrop}>
      <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':undefined}>
        <View style={editorStyles.sheet}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{paddingBottom:spacing(4)}}>
            <Input value={title} onChangeText={setTitle} placeholder="Название задачи" style={{marginBottom:spacing(2),height:56,borderRadius:14}}/>

            <Text style={editorStyles.sectionTitle}>Категории (можно несколько:)</Text>
            <View style={{flexDirection:'row',flexWrap:'wrap',gap:spacing(1),marginTop:spacing(1),marginBottom:spacing(2)}}>
              {(['home','work','global','personal','habit','urgent'] as CategoryKey[]).map(c=>{
                const selected=categories.includes(c);
                const color=(colors.categories as any)[c]||colors.accent;
                return (
                  <TouchableOpacity key={c} onPress={()=>toggleCategory(c)} style={[editorStyles.catChip,{borderColor:selected?color:colors.border,backgroundColor:selected?`${color}22`:'transparent'}]}>
                    <Text style={[editorStyles.catChipText,{color:selected?color:colors.text}]}>{CATEGORY_LABELS[c]}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={editorStyles.settingsCard}>
              {/* Дата и время */}
              <TouchableOpacity style={editorStyles.settingsRow} onPress={()=>setDueOpen(v=>!v)}>
                <Text style={editorStyles.settingsLabel}>Дата и время:</Text>
                <View style={{flexDirection:'row',alignItems:'center',gap:8}}>
                  <Text style={editorStyles.settingsValue}>{formatDateTime(dueDate,dueTime)}</Text>
                  <Text style={{color:colors.subtext,fontSize:20}}>›</Text>
                </View>
              </TouchableOpacity>
              {dueOpen?(
                <View style={{paddingHorizontal:spacing(2),paddingBottom:spacing(2),gap:spacing(1)}}>
                  <Input value={dueDate} onChangeText={setDueDate} placeholder="YYYY-MM-DD"/>
                  <Input value={dueTime} onChangeText={setDueTime} placeholder="HH:mm"/>
                  <View style={{flexDirection:'row',gap:spacing(2)}}>
                    <TouchableOpacity onPress={()=>{ const d=new Date(); d.setMinutes(d.getMinutes()+60); setDueDate(d.toISOString().slice(0,10)); setDueTime(d.toTimeString().slice(0,5)); }}>
                      <Text style={{color:colors.accent,fontWeight:'700'}}>+1 час</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{ setDueDate(''); setDueTime(''); }}>
                      <Text style={{color:colors.subtext}}>Очистить</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ):null}
              <TouchableOpacity style={editorStyles.settingsRow} onPress={()=>{setRepeatOpen(v=>!v);}} onLongPress={cycleRepeat}>
                <Text style={editorStyles.settingsLabel}>Повторение:</Text>
                <View style={{flexDirection:'row',alignItems:'center',gap:8}}>
                  <Text style={editorStyles.settingsValue}>{repeatLabel(repeat??null)}</Text>
                  <Text style={{color:colors.subtext,fontSize:20}}>›</Text>
                </View>
              </TouchableOpacity>
              {repeatOpen?(
                <View style={{paddingHorizontal:spacing(2),paddingBottom:spacing(2),flexDirection:'row',gap:spacing(1)}}>
                  {([null,'daily','weekly','monthly'] as (Task['repeat'])[]).map(r=>{
                    const on=repeat===r;
                    return (
                      <TouchableOpacity key={String(r)} onPress={()=>setRepeat(r)} style={[editorStyles.chip,on&&editorStyles.chipOn]}>
                        <Text style={[editorStyles.chipText,on&&editorStyles.chipTextOn]}>{repeatLabel(r)}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ):null}

              {/* Напоминание */}
              <TouchableOpacity style={editorStyles.settingsRow} onPress={()=>setRemindOpen(v=>!v)}>
                <Text style={editorStyles.settingsLabel}>Напоминание:</Text>
                <View style={{flexDirection:'row',alignItems:'center',gap:8}}>
                  <Text style={editorStyles.settingsValue}>{typeof reminder==='number'?`За ${reminder} мин`:'Нет'}</Text>
                  <Text style={{color:colors.subtext,fontSize:20}}>›</Text>
                </View>
              </TouchableOpacity>
              {remindOpen?(
                <View style={{paddingHorizontal:spacing(2),paddingBottom:spacing(2),flexDirection:'row',gap:spacing(1),flexWrap:'wrap'}}>
                  {[null,5,10,30,60].map((m)=>{
                    const on=reminder===m as any;
                    return (
                      <TouchableOpacity key={String(m)} onPress={()=>setReminder(m as any)} style={[editorStyles.chip,on&&editorStyles.chipOn]}>
                        <Text style={[editorStyles.chipText,on&&editorStyles.chipTextOn]}>{m===null?'Нет':`За ${m} мин`}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ):null}

              {/* Приоритет */}
              <TouchableOpacity style={editorStyles.settingsRow} onPress={()=>setPriorityOpen(v=>!v)}>
                <Text style={editorStyles.settingsLabel}>Приоритет:</Text>
                <View style={{flexDirection:'row',alignItems:'center',gap:8}}>
                  <Text style={editorStyles.settingsValue}>{priority===null?'Нет':priority==='high'?'Высокий':priority==='medium'?'Средний':'Низкий'}</Text>
                  <Text style={{color:colors.subtext,fontSize:20}}>›</Text>
                </View>
              </TouchableOpacity>
              {priorityOpen?(
                <View style={{paddingHorizontal:spacing(2),paddingBottom:spacing(2),flexDirection:'row',gap:spacing(1)}}>
                  {([null,'low','medium','high'] as (Task['priority'])[]).map(p=>{
                    const on=priority===p;
                    const label=p===null?'Нет':p==='high'?'Высокий':p==='medium'?'Средний':'Низкий';
                    return (
                      <TouchableOpacity key={String(p)} onPress={()=>setPriority(p)} style={[editorStyles.chip,on&&editorStyles.chipOn]}>
                        <Text style={[editorStyles.chipText,on&&editorStyles.chipTextOn]}>{label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ):null}
            </View>

            <Text style={editorStyles.sectionTitle}>Подзадачи:</Text>
            <View style={{gap:8,marginTop:spacing(1)}}>
              {subtasks.map(s=>(
                <View key={s.id} style={{flexDirection:'row',alignItems:'center',gap:10}}>
                  <View style={{width:20,height:20,borderRadius:10,borderWidth:2,borderColor:colors.border}}/>
                  <View style={{flex:1}}>
                    <TextInput
                      value={s.title}
                      onChangeText={(txt)=>updateSub(s.id,txt)}
                      placeholder="Текст подзадачи"
                      placeholderTextColor={colors.subtext}
                      style={[editorStyles.input,{paddingVertical:10}]}
                    />
                  </View>
                  <TouchableOpacity onPress={()=>removeSub(s.id)} hitSlop={{top:8,bottom:8,left:8,right:8}}><Text style={{color:'#a3a3aa',fontSize:18}}>⋯</Text></TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity onPress={addSub}><Text style={{color:colors.text,fontWeight:'700'}}>+ Добавить подзадачу</Text></TouchableOpacity>
            </View>

            <Text style={editorStyles.sectionTitle}>Заметки</Text>
            <Input value={notes} onChangeText={setNotes} placeholder="Заметки" multiline style={{marginTop:spacing(1)}}/>

            <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:spacing(2)}}>
              <TouchableOpacity onPress={onDelete}><Text style={{color:'#ef4444',fontWeight:'700'}}>Удалить</Text></TouchableOpacity>
              <View style={{flexDirection:'row',gap:spacing(2)}}>
                <TouchableOpacity onPress={onClose}><Text style={{color:colors.subtext}}>Отмена</Text></TouchableOpacity>
                <TouchableOpacity onPress={()=>onSave({
                  ...task,
                  title:title.trim()||'Новая задача',
                  notes:notes.trim()||undefined,
                  categories:categories,
                  repeat:repeat??null,
                  dueAt:(dueDate&&dueTime)?`${dueDate}T${dueTime}:00` : undefined,
                  reminderMinutesBefore: typeof reminder==='number'?reminder:undefined,
                  priority:priority||undefined,
                  subtasks:subtasks.filter(s=>s.title.trim().length>0),
                  updatedAt:new Date().toISOString()
                })}><Text style={{color:colors.accent,fontWeight:'800'}}>Сохранить</Text></TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function Input({value,onChangeText,placeholder,style,multiline}:{value:string;onChangeText:(t:string)=>void;placeholder?:string;style?:any;multiline?:boolean}){
  return (
    <View style={[editorStyles.input, multiline&&{height:100,alignItems:'flex-start'} ,style]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.subtext}
        style={{color:colors.text,flex:1}}
        multiline={multiline}
      />
    </View>
  );
}

const editorStyles=StyleSheet.create({
  backdrop:{position:'absolute',left:0,top:0,right:0,bottom:0,backgroundColor:'#000000aa',justifyContent:'flex-end'},
  sheet:{backgroundColor:colors.card,borderTopLeftRadius:18,borderTopRightRadius:18,padding:spacing(2),gap:spacing(1)},
  sectionTitle:{color:colors.text,fontSize:18,fontWeight:'800',marginBottom:spacing(1)},
  chip:{paddingHorizontal:12,paddingVertical:6,borderRadius:999,borderWidth:1,borderColor:colors.border},
  chipOn:{backgroundColor:'#1f2937',borderColor:'#1f2937'},
  chipText:{color:colors.subtext,fontSize:14},
  chipTextOn:{color:'#fff',fontWeight:'700'},
  input:{borderWidth:1,borderColor:colors.border,borderRadius:10,paddingHorizontal:12,paddingVertical:12},
  settingsCard:{backgroundColor:'#111214',borderRadius:18,borderWidth:1,borderColor:colors.border,marginBottom:spacing(2)},
  settingsRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:spacing(2),paddingVertical:spacing(1.5),borderBottomWidth:1,borderBottomColor:'#1c1d22'},
  settingsLabel:{color:colors.text,fontSize:18,fontWeight:'700'},
  settingsValue:{color:colors.text,fontSize:18,fontWeight:'700'},
  catChip:{paddingHorizontal:14,paddingVertical:8,borderRadius:999,borderWidth:1},
  catChipText:{fontSize:16,fontWeight:'700'}
});