export type CategoryKey = 'work'|'home'|'global'|'habit'|'personal'|'urgent'|string;

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  categories: CategoryKey[]; // поддержка нескольких категорий
  dueAt?: string;
  repeat?: 'daily'|'weekly'|'monthly'|null;
  reminderMinutesBefore?: number;
  priority?: 'low'|'medium'|'high';
  notes?: string;
  subtasks?: Subtask[];
  done: boolean;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string; // время завершения задачи
}