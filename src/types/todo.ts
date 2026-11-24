export type Priority = 'low' | 'medium' | 'high';

export type FilterTab = 'all' | 'active' | 'completed';

export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  createdAt: number;
}

export interface TaskCounts {
  total: number;
  active: number;
  completed: number;
}
