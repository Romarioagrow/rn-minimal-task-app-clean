import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';
import type { Task, CategoryKey } from '../types';

interface Props {
  task: Task;
  customCategories: string[];
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete: () => void;
  onAddCustomCategory: (category: string) => void;
}

export default function TaskDetailScreen({ 
  task, 
  customCategories, 
  onClose, 
  onSave, 
  onDelete, 
  onAddCustomCategory 
}: Props) {
  console.log('TaskDetailScreen rendered with task:', task.title);
  const [title, setTitle] = useState(task.title);
  const [notes, setNotes] = useState(task.notes || '');
  const [categories, setCategories] = useState<CategoryKey[]>(task.categories);
  const [repeat, setRepeat] = useState<Task['repeat']>(task.repeat ?? null);
  const [dueDate, setDueDate] = useState<string>(task.dueAt ? new Date(task.dueAt).toISOString().slice(0, 10) : '');
  const [dueTime, setDueTime] = useState<string>(task.dueAt ? new Date(task.dueAt).toTimeString().slice(0, 5) : '');
  const [reminder, setReminder] = useState<number | undefined>(task.reminderMinutesBefore);
  const [priority, setPriority] = useState<Task['priority']>(task.priority ?? null);
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [isEditing, setIsEditing] = useState(false);

  const CATEGORY_LABELS: Record<CategoryKey, string> = {
    work: 'Работа',
    home: 'Дом',
    global: 'Глобальное',
    habit: 'Повтор',
    personal: 'Личное',
    urgent: 'Срочно'
  };

  const toggleCategory = (c: CategoryKey) => setCategories(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  const addSub = () => setSubtasks(prev => [...prev, { id: String(Date.now()), title: '', done: false }]);
  const updateSub = (id: string, title: string) => setSubtasks(prev => prev.map(s => s.id === id ? { ...s, title } : s));
  const removeSub = (id: string) => setSubtasks(prev => prev.filter(s => s.id !== id));

  const repeatLabel = (r: Task['repeat']) => r === null ? 'Нет' : r === 'daily' ? 'Ежедневно' : r === 'weekly' ? 'Еженедельно' : 'Ежемесячно';
  
  const formatDateTime = (dateStr: string, timeStr: string) => {
    if (!dateStr || !timeStr) return 'Не задано';
    try {
      const d = new Date(`${dateStr}T${timeStr}:00`);
      const now = new Date();
      const isToday = d.toDateString() === now.toDateString();
      const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1);
      const isTomorrow = d.toDateString() === tomorrow.toDateString();
      const time = timeStr;
      if (isToday) return `Сегодня, ${time}`;
      if (isTomorrow) return `Завтра, ${time}`;
      return `${d.toLocaleDateString()}, ${time}`;
    } catch { return 'Не задано'; }
  };

  const handleSave = () => {
    onSave({
      ...task,
      title: title.trim() || 'Новая задача',
      notes: notes.trim() || undefined,
      categories: categories,
      repeat: repeat ?? null,
      dueAt: (dueDate && dueTime) ? `${dueDate}T${dueTime}:00` : undefined,
      reminderMinutesBefore: typeof reminder === 'number' ? reminder : undefined,
      priority: priority || undefined,
      subtasks: subtasks.filter(s => s.title.trim().length > 0),
      updatedAt: new Date().toISOString(),
      completedAt: task.completedAt
    });
    setIsEditing(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
        {/* Заголовок */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditing ? 'Редактирование' : 'Просмотр задачи'}
          </Text>
          <TouchableOpacity 
            onPress={() => isEditing ? handleSave() : setIsEditing(true)} 
            style={styles.actionButton}
          >
            <Text style={styles.actionText}>
              {isEditing ? 'Сохранить' : 'Изменить'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Название задачи */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Название</Text>
            {isEditing ? (
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Название задачи"
                placeholderTextColor={colors.subtext}
                style={styles.titleInput}
                multiline
              />
            ) : (
              <Text style={styles.titleText}>{task.title || '(без названия)'}</Text>
            )}
          </View>

          {/* Категории */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Категории</Text>
            <View style={styles.categoriesContainer}>
              {(['home', 'work', 'global', 'personal', 'habit', 'urgent'] as CategoryKey[]).map(c => {
                const selected = categories.includes(c);
                const color = (colors.categories as any)[c] || colors.accent;
                return (
                  <TouchableOpacity
                    key={c}
                    onPress={() => isEditing && toggleCategory(c)}
                    style={[
                      styles.categoryChip,
                      {
                        borderColor: selected ? color : colors.border,
                        backgroundColor: selected ? `${color}22` : 'transparent',
                        opacity: isEditing ? 1 : 0.7
                      }
                    ]}
                    disabled={!isEditing}
                  >
                    <Text style={[styles.categoryText, { color: selected ? color : colors.text }]}>
                      {CATEGORY_LABELS[c]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              {customCategories.map(c => {
                const selected = categories.includes(c);
                return (
                  <TouchableOpacity
                    key={c}
                    onPress={() => isEditing && toggleCategory(c)}
                    style={[
                      styles.categoryChip,
                      {
                        borderColor: selected ? colors.accent : colors.border,
                        backgroundColor: selected ? `${colors.accent}22` : 'transparent',
                        opacity: isEditing ? 1 : 0.7
                      }
                    ]}
                    disabled={!isEditing}
                  >
                    <Text style={[styles.categoryText, { color: selected ? colors.accent : colors.text }]}>
                      {c}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Цели */}
          {subtasks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Цели</Text>
              <View style={styles.goalsContainer}>
                {subtasks.map(s => (
                  <View key={s.id} style={styles.goalItem}>
                    <View style={[styles.goalCheckbox, s.done && styles.goalCheckboxDone]} />
                    {isEditing ? (
                      <TextInput
                        value={s.title}
                        onChangeText={(txt) => updateSub(s.id, txt)}
                        placeholder="Текст цели"
                        placeholderTextColor={colors.subtext}
                        style={styles.goalInput}
                      />
                    ) : (
                      <Text style={[styles.goalText, s.done && styles.goalTextDone]}>
                        {s.title}
                      </Text>
                    )}
                    {isEditing && (
                      <TouchableOpacity onPress={() => removeSub(s.id)} style={styles.removeGoalButton}>
                        <Text style={styles.removeGoalText}>×</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                {isEditing && (
                  <TouchableOpacity onPress={addSub} style={styles.addGoalButton}>
                    <Text style={styles.addGoalText}>+ Добавить цель</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* Время и приоритет */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Время и приоритет</Text>
            
            {/* Дата и время */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Дата и время:</Text>
              {isEditing ? (
                <View style={styles.dateTimeEdit}>
                  <TextInput
                    value={dueDate}
                    onChangeText={setDueDate}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={colors.subtext}
                    style={styles.dateInput}
                  />
                  <TextInput
                    value={dueTime}
                    onChangeText={setDueTime}
                    placeholder="HH:mm"
                    placeholderTextColor={colors.subtext}
                    style={styles.timeInput}
                  />
                </View>
              ) : (
                <Text style={styles.infoValue}>{formatDateTime(dueDate, dueTime)}</Text>
              )}
            </View>

            {/* Повторение */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Повторение:</Text>
              {isEditing ? (
                <View style={styles.repeatOptions}>
                  {([null, 'daily', 'weekly', 'monthly'] as (Task['repeat'])[]).map(r => {
                    const selected = repeat === r;
                    return (
                      <TouchableOpacity
                        key={String(r)}
                        onPress={() => setRepeat(r)}
                        style={[styles.repeatChip, selected && styles.repeatChipSelected]}
                      >
                        <Text style={[styles.repeatChipText, selected && styles.repeatChipTextSelected]}>
                          {repeatLabel(r)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : (
                <Text style={styles.infoValue}>{repeatLabel(repeat)}</Text>
              )}
            </View>

            {/* Напоминание */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Напоминание:</Text>
              {isEditing ? (
                <View style={styles.reminderOptions}>
                  {[null, 5, 10, 30, 60].map(m => {
                    const selected = reminder === m;
                    return (
                      <TouchableOpacity
                        key={String(m)}
                        onPress={() => setReminder(m as any)}
                        style={[styles.reminderChip, selected && styles.reminderChipSelected]}
                      >
                        <Text style={[styles.reminderChipText, selected && styles.reminderChipTextSelected]}>
                          {m === null ? 'Нет' : `За ${m} мин`}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : (
                <Text style={styles.infoValue}>
                  {typeof reminder === 'number' ? `За ${reminder} мин` : 'Нет'}
                </Text>
              )}
            </View>

            {/* Приоритет */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Приоритет:</Text>
              {isEditing ? (
                <View style={styles.priorityOptions}>
                  {([null, 'low', 'medium', 'high'] as (Task['priority'])[]).map(p => {
                    const selected = priority === p;
                    const label = p === null ? 'Нет' : p === 'high' ? 'Высокий' : p === 'medium' ? 'Средний' : 'Низкий';
                    return (
                      <TouchableOpacity
                        key={String(p)}
                        onPress={() => setPriority(p)}
                        style={[styles.priorityChip, selected && styles.priorityChipSelected]}
                      >
                        <Text style={[styles.priorityChipText, selected && styles.priorityChipTextSelected]}>
                          {label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : (
                <Text style={styles.infoValue}>
                  {priority === null ? 'Нет' : priority === 'high' ? 'Высокий' : priority === 'medium' ? 'Средний' : 'Низкий'}
                </Text>
              )}
            </View>
          </View>

          {/* Заметки */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Заметки</Text>
            {isEditing ? (
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Дополнительная информация, идеи, детали..."
                placeholderTextColor={colors.subtext}
                style={styles.notesInput}
                multiline
                textAlignVertical="top"
              />
            ) : (
              <Text style={styles.notesText}>
                {task.notes || 'Заметок нет'}
              </Text>
            )}
          </View>

          {/* Информация о задаче */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Информация</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Создана:</Text>
              <Text style={styles.infoValue}>
                {new Date(task.createdAt).toLocaleDateString()}
              </Text>
            </View>
            {task.updatedAt && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Изменена:</Text>
                <Text style={styles.infoValue}>
                  {new Date(task.updatedAt).toLocaleDateString()}
                </Text>
              </View>
            )}
            {task.completedAt && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Завершена:</Text>
                <Text style={styles.infoValue}>
                  {new Date(task.completedAt).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Кнопка удаления */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Удалить задачу</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.bg,
    zIndex: 1000,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1.5),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 18,
    color: colors.text,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  actionButton: {
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
    borderRadius: 8,
    backgroundColor: colors.accent,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing(2),
  },
  section: {
    marginTop: spacing(3),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing(1.5),
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing(2),
    minHeight: 60,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 28,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(1),
  },
  categoryChip: {
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.75),
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  goalsContainer: {
    gap: spacing(1),
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1.5),
    paddingVertical: spacing(0.5),
  },
  goalCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
  },
  goalCheckboxDone: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  goalInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: spacing(1),
  },
  goalText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  goalTextDone: {
    textDecorationLine: 'line-through',
    color: colors.subtext,
  },
  removeGoalButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeGoalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addGoalButton: {
    paddingVertical: spacing(1),
    paddingHorizontal: spacing(1.5),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accent,
    alignSelf: 'flex-start',
  },
  addGoalText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing(1),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  infoValue: {
    fontSize: 16,
    color: colors.subtext,
    textAlign: 'right',
    flex: 1,
    marginLeft: spacing(2),
  },
  dateTimeEdit: {
    flexDirection: 'row',
    gap: spacing(1),
  },
  dateInput: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: spacing(1),
    color: colors.text,
    fontSize: 14,
    minWidth: 100,
  },
  timeInput: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: spacing(1),
    color: colors.text,
    fontSize: 14,
    minWidth: 80,
  },
  repeatOptions: {
    flexDirection: 'row',
    gap: spacing(1),
  },
  repeatChip: {
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.5),
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  repeatChipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  repeatChipText: {
    fontSize: 12,
    color: colors.subtext,
  },
  repeatChipTextSelected: {
    color: '#000',
    fontWeight: '700',
  },
  reminderOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(1),
  },
  reminderChip: {
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.5),
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reminderChipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  reminderChipText: {
    fontSize: 12,
    color: colors.subtext,
  },
  reminderChipTextSelected: {
    color: '#000',
    fontWeight: '700',
  },
  priorityOptions: {
    flexDirection: 'row',
    gap: spacing(1),
  },
  priorityChip: {
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.5),
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  priorityChipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  priorityChipText: {
    fontSize: 12,
    color: colors.subtext,
  },
  priorityChipTextSelected: {
    color: '#000',
    fontWeight: '700',
  },
  notesInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing(2),
    color: colors.text,
    fontSize: 16,
    minHeight: 100,
  },
  notesText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing(2),
  },
  footer: {
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(2),
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: spacing(2),
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
