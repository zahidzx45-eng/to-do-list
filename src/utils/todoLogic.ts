import type { FilterTab, Priority, TaskCounts, TodoItem } from '../types/todo';

export const STORAGE_KEY = 'clearlist_tasks_v1';

export const SEED_TASKS: TodoItem[] = [
  {
    id: 'seed-1',
    title: 'Finalize Q4 product roadmap milestones',
    completed: false,
    priority: 'high',
    dueDate: '2026-11-25',
    createdAt: 1732400000000,
  },
  {
    id: 'seed-2',
    title: 'Review design system contrast audit',
    completed: false,
    priority: 'medium',
    dueDate: '2026-11-28',
    createdAt: 1732390000000,
  },
  {
    id: 'seed-3',
    title: 'Archive completed sprint notes',
    completed: true,
    priority: 'low',
    dueDate: null,
    createdAt: 1732380000000,
  },
];

export function validateTitle(rawTitle: string): string | null {
  const trimmed = rawTitle.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function normalizeDueDate(rawDueDate?: string | null): string | null {
  if (!rawDueDate) return null;
  const trimmed = rawDueDate.trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? trimmed : null;
}

export function generateTaskId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createTask(params: {
  title: string;
  dueDate?: string | null;
  priority?: Priority;
  id?: string;
  now?: number;
}): TodoItem | null {
  const validTitle = validateTitle(params.title);
  if (!validTitle) return null;

  return {
    id: params.id ?? generateTaskId(),
    title: validTitle,
    completed: false,
    priority: params.priority ?? 'medium',
    dueDate: normalizeDueDate(params.dueDate),
    createdAt: params.now ?? Date.now(),
  };
}

export function toggleTask(tasks: TodoItem[], id: string): TodoItem[] {
  return tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
}

export function updateTask(
  tasks: TodoItem[],
  id: string,
  updates: { title: string; dueDate?: string | null; priority: Priority }
): TodoItem[] {
  const validTitle = validateTitle(updates.title);
  if (!validTitle) return tasks;

  const normalizedDate = normalizeDueDate(updates.dueDate);
  return tasks.map((task) =>
    task.id === id
      ? {
          ...task,
          title: validTitle,
          dueDate: normalizedDate,
          priority: updates.priority,
        }
      : task
  );
}

export function deleteTask(tasks: TodoItem[], id: string): TodoItem[] {
  return tasks.filter((task) => task.id !== id);
}

export function clearCompletedTasks(tasks: TodoItem[]): TodoItem[] {
  return tasks.filter((task) => !task.completed);
}

export function filterAndSearchTasks(
  tasks: TodoItem[],
  filter: FilterTab,
  searchQuery: string
): TodoItem[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return tasks.filter((task) => {
    if (filter === 'active' && task.completed) return false;
    if (filter === 'completed' && !task.completed) return false;
    if (normalizedQuery.length > 0) {
      return task.title.toLowerCase().includes(normalizedQuery);
    }
    return true;
  });
}

export function getTaskCounts(tasks: TodoItem[]): TaskCounts {
  let active = 0;
  let completed = 0;
  for (const task of tasks) {
    if (task.completed) {
      completed += 1;
    } else {
      active += 1;
    }
  }
  return {
    total: tasks.length,
    active,
    completed,
  };
}

export function getLocalTodayIso(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isTaskOverdue(
  dueDate: string | null,
  completed: boolean,
  todayIso: string = getLocalTodayIso()
): boolean {
  if (!dueDate || completed) return false;
  return dueDate < todayIso;
}

export function formatDueDateLabel(
  dueDate: string | null,
  todayIso: string = getLocalTodayIso()
): string | null {
  if (!dueDate) return null;
  if (dueDate === todayIso) return 'Today';

  const parts = dueDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return dueDate;
  const [year, month, day] = parts;
  const target = new Date(year, month - 1, day);

  const todayParts = todayIso.split('-').map(Number);
  const todayDate = new Date(todayParts[0], todayParts[1] - 1, todayParts[2]);
  const diffDays = Math.round(
    (target.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';

  const sameYear = year === todayParts[0];
  return target.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
}

function isValidTodoItem(value: unknown): value is TodoItem {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    candidate.title.trim().length > 0 &&
    typeof candidate.completed === 'boolean' &&
    (candidate.priority === 'low' ||
      candidate.priority === 'medium' ||
      candidate.priority === 'high') &&
    (candidate.dueDate === null || typeof candidate.dueDate === 'string') &&
    typeof candidate.createdAt === 'number'
  );
}

export function loadTasksFromStorage(
  storage: Pick<Storage, 'getItem'> | null,
  seedTasks: TodoItem[] = SEED_TASKS
): TodoItem[] {
  if (!storage) return seedTasks;
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) {
      return seedTasks;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return seedTasks;
    }
    return parsed.filter(isValidTodoItem);
  } catch {
    return seedTasks;
  }
}

export function saveTasksToStorage(
  storage: Pick<Storage, 'setItem'> | null,
  tasks: TodoItem[]
): void {
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Ignore storage quota or private browsing errors gracefully
  }
}
