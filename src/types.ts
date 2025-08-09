export type CategoryKey = 'work'|'home'|'global'|'habit'|'personal'|'urgent';

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
  notes?: string;
  subtasks?: Subtask[];
  done: boolean;
  createdAt: string;
}