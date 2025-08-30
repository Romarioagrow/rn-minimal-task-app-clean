import React,{useEffect,useMemo,useState,useCallback}from'react';
import{View,Text,StyleSheet,FlatList,TouchableOpacity,TextInput,KeyboardAvoidingView,Platform,ScrollView}from'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import{colors,spacing}from'../theme';
import TaskItem from'../components/TaskItem';

import type{Task,CategoryKey}from'../types';
import{loadTasks,saveTasks,loadCustomCategories,saveCustomCategories}from'../storage';

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
const[customCategories,setCustomCategories]=useState<string[]>([]);
useEffect(()=>{(async()=>{const stored=await loadTasks();setTasks(stored.length?stored:defaultData);})();},[]);
useEffect(()=>{saveTasks(tasks);},[tasks]);
useEffect(()=>{(async()=>{const stored=await loadCustomCategories();setCustomCategories(stored);})();},[]);
useEffect(()=>{saveCustomCategories(customCategories);},[customCategories]);



const list=useMemo(()=>tasks.filter(t=>filter==='all'?true:t.categories.includes(filter)),[tasks,filter]);

// Создаем динамический объект меток, включающий пользовательские категории
const getCategoryLabels = useCallback(() => {
  const baseLabels: Record<CategoryKey, string> = {
    work: 'Работа',
    home: 'Дом', 
    global: 'Глобальное',
    habit: 'Повтор',
    personal: 'Личное',
    urgent: 'Срочно'
  };
  
  // Добавляем пользовательские категории
  customCategories.forEach(cat => {
    baseLabels[cat] = cat;
  });
  
  return baseLabels;
}, [customCategories]);

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
  <TaskItem task={item} onToggle={toggle} onToggleSub={toggleSub} onDelete={handleDelete} customCategories={customCategories}/>
),[toggle,toggleSub,customCategories]);





return(
  <SafeAreaView style={styles.safe} edges={['top','left','right','bottom']}>
    <View style={styles.container}>

      <Text style={styles.h1}>Задачи</Text>
      <Text style={styles.caption}>Всего: {list.length} • Активных: {list.filter(t=>!t.done).length}</Text>
      <View style={styles.filtersContainer}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          style={{ maxHeight: 120 }}
          nestedScrollEnabled={true}
        >
          <View style={styles.filters}>
            <TouchableOpacity key={'all'} style={[styles.fbtn,filter==='all'&&styles.fbtnOn]} onPress={()=>setFilter('all')}>
              <Text style={[styles.ftext,filter==='all'&&styles.ftextOn]}>Все</Text>
            </TouchableOpacity>
            {Array.from(new Set(tasks.flatMap(t=>t.categories))).map((c)=> (
              <TouchableOpacity key={c} style={[styles.fbtn,filter===c&&styles.fbtnOn]} onPress={()=>setFilter(c as CategoryKey)}>
                <Text style={[styles.ftext,filter===c&&styles.ftextOn]}>{getCategoryLabels()[c as CategoryKey]||String(c)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      <FlatList
        data={list}
        keyExtractor={i=>i.id}
        renderItem={renderItem}
        contentContainerStyle={{paddingBottom:spacing(8)}}
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
          customCategories={customCategories}
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
          onAddCustomCategory={(category) => {
            if (!customCategories.includes(category)) {
              setCustomCategories(prev => [...prev, category]);
            }
          }}
        />
      ):null}
    </View>
  </SafeAreaView>
);
}

const styles=StyleSheet.create({
safe:{flex:1,backgroundColor:colors.bg},
container:{flex:1,paddingHorizontal:spacing(1.5),paddingTop:spacing(1)},
h1:{color:'#ffffff',fontSize:24,fontWeight:'800'},
caption:{color:'#a3a3aa',marginBottom:spacing(1),fontSize:14,fontWeight:'400'},
filtersContainer:{marginBottom:spacing(2)},
filters:{flexDirection:'row',flexWrap:'wrap',gap:6,alignItems:'flex-start',justifyContent:'center',paddingHorizontal:spacing(1),paddingVertical:spacing(1)},
fbtn:{paddingHorizontal:spacing(1),paddingVertical:6,borderRadius:999,borderWidth:1,borderColor:'#2a2a2e',marginBottom:4},
fbtnOn:{backgroundColor:'#1f2937'},
ftext:{color:'#a3a3aa',fontSize:12,fontWeight:'500'},
ftextOn:{color:'#ffffff',fontWeight:'700'},
fab:{position:'absolute',right:spacing(2),bottom:spacing(2),width:48,height:48,borderRadius:24,backgroundColor:'#ffcc00',alignItems:'center',justifyContent:'center'},
fabPlus:{fontSize:24,fontWeight:'700'}
});

// Редактор задачи — простая модалка без сторонних библиотек
function TaskEditor({task,customCategories,onClose,onSave,onDelete,onAddCustomCategory}:{task:Task;customCategories:string[];onClose:()=>void;onSave:(t:Task)=>void;onDelete:()=>void;onAddCustomCategory:(category:string)=>void}){
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
   const [settingsOpen,setSettingsOpen]=useState(false);
   const [categoriesOpen,setCategoriesOpen]=useState(false);
   const [goalsOpen,setGoalsOpen]=useState(false);
   const [customCategoryInput,setCustomCategoryInput]=useState('');
   const [showCustomInput,setShowCustomInput]=useState(false);

  const CATEGORY_LABELS:Record<CategoryKey,string>={work:'Работа',home:'Дом',global:'Глобальное',habit:'Повтор',personal:'Личное',urgent:'Срочно'};
  const toggleCategory=(c:CategoryKey)=>setCategories(prev=>prev.includes(c)?prev.filter(x=>x!==c):[...prev,c]);
  const addSub=()=>setSubtasks(prev=>[...prev,{id:String(Date.now()),title:'',done:false}]);
  const updateSub=(id:string,title:string)=>setSubtasks(prev=>prev.map(s=>s.id===id?{...s,title}:s));
  const removeSub=(id:string)=>setSubtasks(prev=>prev.filter(s=>s.id!==id));
  
  const addCustomCategory = () => {
    if (customCategoryInput.trim()) {
      const newCategory = customCategoryInput.trim();
      setCategories(prev => [...prev, newCategory]);
      onAddCustomCategory(newCategory);
      setCustomCategoryInput('');
      setShowCustomInput(false);
    }
  };

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
                          <Text style={editorStyles.sectionTitle}>Новая задача</Text>
                            <Input value={title} onChangeText={setTitle} placeholder="Что нужно сделать? Опишите вашу задачу..." multiline style={{marginBottom:spacing(2),height:80,borderRadius:10}}/>

              <TouchableOpacity 
                style={editorStyles.settingsToggle} 
                onPress={() => setGoalsOpen(!goalsOpen)}
              >
                <Text style={editorStyles.settingsToggleText}>
                  {goalsOpen ? '▼' : '▶'} Цели
                </Text>
              </TouchableOpacity>

              {goalsOpen && (
              <View style={{gap:8,marginTop:spacing(1)}}>
                {subtasks.map(s=>(
                  <View key={s.id} style={{flexDirection:'row',alignItems:'center',gap:10}}>
                    <View style={{width:20,height:20,borderRadius:10,borderWidth:2,borderColor:colors.border}}/>
                    <View style={{flex:1}}>
                                            <TextInput
                         value={s.title}
                         onChangeText={(txt)=>updateSub(s.id,txt)}
                         placeholder="Текст цели"
                         placeholderTextColor={colors.subtext}
                         style={[editorStyles.input,{paddingVertical:10,color:colors.text}]}
                       />
                    </View>
                    <TouchableOpacity onPress={()=>removeSub(s.id)} hitSlop={{top:8,bottom:8,left:8,right:8}}><Text style={{color:'#a3a3aa',fontSize:18}}>⋯</Text></TouchableOpacity>
                  </View>
                ))}
                               <TouchableOpacity onPress={addSub} style={{marginTop:spacing(0.25), marginLeft:spacing(1)}}>
                  <Text style={{color:colors.accent,fontWeight:'700',fontSize:16}}>+ Добавить цель</Text>
                </TouchableOpacity>
              </View>
              )}

                         <TouchableOpacity 
               style={editorStyles.settingsToggle} 
               onPress={() => setCategoriesOpen(!categoriesOpen)}
             >
               <Text style={editorStyles.settingsToggleText}>
                 {categoriesOpen ? '▼' : '▶'} Категории
               </Text>
             </TouchableOpacity>

                          {categoriesOpen && (
                <View>
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
                   
                   {/* Кнопка "Своя" */}
                   <TouchableOpacity 
                     onPress={() => setShowCustomInput(!showCustomInput)} 
                     style={[editorStyles.catChip,{borderColor:colors.accent,backgroundColor:'transparent'}]}
                   >
                     <Text style={[editorStyles.catChipText,{color:colors.accent}]}>Своя</Text>
                   </TouchableOpacity>
                   
                   {/* Пользовательские категории */}
                   {categories.filter(c => !['home','work','global','personal','habit','urgent'].includes(c)).map(c => {
                     const selected = categories.includes(c);
                     return (
                       <TouchableOpacity key={c} onPress={()=>toggleCategory(c)} style={[editorStyles.catChip,{borderColor:selected?colors.accent:colors.border,backgroundColor:selected?`${colors.accent}22`:'transparent'}]}>
                         <Text style={[editorStyles.catChipText,{color:selected?colors.accent:colors.text}]}>{c}</Text>
                       </TouchableOpacity>
                     );
                   })}
                 </View>
                 
                 {/* Поле ввода для новой категории */}
                 {showCustomInput && (
                   <View style={{flexDirection:'row',gap:spacing(1),marginTop:spacing(1)}}>
                     <TextInput
                       value={customCategoryInput}
                       onChangeText={setCustomCategoryInput}
                       placeholder="Название категории"
                       placeholderTextColor={colors.subtext}
                       style={[editorStyles.input,{flex:1,color:colors.text}]}
                       onSubmitEditing={addCustomCategory}
                     />
                     <TouchableOpacity 
                       onPress={addCustomCategory}
                       style={[editorStyles.catChip,{borderColor:colors.accent,backgroundColor:colors.accent}]}
                     >
                       <Text style={[editorStyles.catChipText,{color:'#000'}]}>+</Text>
                     </TouchableOpacity>
                   </View>
                 )}
               </View>
             )}

                            <TouchableOpacity 
                 style={editorStyles.settingsToggle} 
                 onPress={() => setSettingsOpen(!settingsOpen)}
               >
                 <Text style={editorStyles.settingsToggleText}>
                   {settingsOpen ? '▼' : '▶'} Время и приоритет
                 </Text>
               </TouchableOpacity>

              {settingsOpen && (
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
                           )}

                           <Text style={[editorStyles.sectionTitle, {marginTop: spacing(2)}]}>Заметки</Text>
             <Input value={notes} onChangeText={setNotes} placeholder="Дополнительная информация, идеи, детали..." multiline style={{marginTop:spacing(1),height:80,borderRadius:10}}/>

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
   sheet:{backgroundColor:colors.card,borderTopLeftRadius:16,borderTopRightRadius:16,padding:spacing(1.5),gap:spacing(1)},
   settingsToggle:{paddingVertical:spacing(1),paddingHorizontal:spacing(1.5),borderRadius:8,borderWidth:1,borderColor:colors.border,backgroundColor:'#111214',marginBottom:spacing(1)},
   settingsToggleText:{color:colors.text,fontSize:16,fontWeight:'700'},
       sectionTitle:{color:colors.text,fontSize:17,fontWeight:'800',marginBottom:spacing(1)},
  chip:{paddingHorizontal:10,paddingVertical:4,borderRadius:999,borderWidth:1,borderColor:colors.border},
  chipOn:{backgroundColor:'#1f2937',borderColor:'#1f2937'},
  chipText:{color:colors.subtext,fontSize:12,fontWeight:'400'},
  chipTextOn:{color:'#fff',fontWeight:'700'},
  input:{borderWidth:1,borderColor:colors.border,borderRadius:8,paddingHorizontal:10,paddingVertical:8},
  settingsCard:{backgroundColor:'#111214',borderRadius:14,borderWidth:1,borderColor:colors.border,marginBottom:spacing(2)},
  settingsRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:spacing(1.5),paddingVertical:spacing(1),borderBottomWidth:1,borderBottomColor:'#1c1d22'},
  settingsLabel:{color:colors.text,fontSize:14,fontWeight:'700'},
  settingsValue:{color:colors.text,fontSize:14,fontWeight:'700'},
  catChip:{paddingHorizontal:12,paddingVertical:6,borderRadius:999,borderWidth:1},
  catChipText:{fontSize:14,fontWeight:'700'}
});