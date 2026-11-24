import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clearCompletedTasks,
  createTask,
  deleteTask,
  filterAndSearchTasks,
  formatDueDateLabel,
  getTaskCounts,
  isTaskOverdue,
  loadTasksFromStorage,
  saveTasksToStorage,
  STORAGE_KEY,
  toggleTask,
  updateTask,
  validateTitle,
} from './todoLogic';
import type { TodoItem } from '../types/todo';

test('validateTitle trims whitespace and rejects empty strings', () => {
  assert.equal(validateTitle('   '), null);
  assert.equal(validateTitle(''), null);
  assert.equal(validateTitle('  Buy groceries  '), 'Buy groceries');
});

test('createTask creates task with trimmed title, normalized date, and defaults', () => {
  const created = createTask({
    title: '  Ship release  ',
    dueDate: '2026-12-01',
    priority: 'high',
    id: 't-1',
    now: 1000,
  });
  assert.deepEqual(created, {
    id: 't-1',
    title: 'Ship release',
    completed: false,
    priority: 'high',
    dueDate: '2026-12-01',
    createdAt: 1000,
  });

  const invalid = createTask({ title: '   ' });
  assert.equal(invalid, null);

  const emptyDate = createTask({
    title: 'No date task',
    dueDate: '',
    priority: 'low',
    id: 't-2',
    now: 2000,
  });
  assert.equal(emptyDate?.dueDate, null);
});

test('toggleTask, updateTask, deleteTask, and clearCompletedTasks behave immutably', () => {
  const initial: TodoItem[] = [
    {
      id: '1',
      title: 'Draft brief',
      completed: false,
      priority: 'low',
      dueDate: null,
      createdAt: 1,
    },
    {
      id: '2',
      title: 'Submit tax form',
      completed: true,
      priority: 'high',
      dueDate: '2026-11-20',
      createdAt: 2,
    },
  ];

  const toggled = toggleTask(initial, '1');
  assert.equal(toggled[0].completed, true);
  assert.equal(initial[0].completed, false);

  const updated = updateTask(initial, '1', {
    title: '  Publish brief  ',
    dueDate: '2026-11-30',
    priority: 'high',
  });
  assert.equal(updated[0].title, 'Publish brief');
  assert.equal(updated[0].dueDate, '2026-11-30');
  assert.equal(updated[0].priority, 'high');

  const invalidUpdate = updateTask(initial, '1', {
    title: '   ',
    dueDate: null,
    priority: 'low',
  });
  assert.equal(invalidUpdate[0].title, 'Draft brief');

  const deleted = deleteTask(initial, '1');
  assert.equal(deleted.length, 1);
  assert.equal(deleted[0].id, '2');

  const cleared = clearCompletedTasks(initial);
  assert.equal(cleared.length, 1);
  assert.equal(cleared[0].id, '1');
});

test('filterAndSearchTasks and getTaskCounts accurately filter by status and query', () => {
  const items: TodoItem[] = [
    { id: '1', title: 'Buy milk', completed: false, priority: 'low', dueDate: null, createdAt: 1 },
    { id: '2', title: 'Buy coffee beans', completed: true, priority: 'medium', dueDate: null, createdAt: 2 },
    { id: '3', title: 'Write quarterly report', completed: false, priority: 'high', dueDate: null, createdAt: 3 },
  ];

  assert.deepEqual(getTaskCounts(items), { total: 3, active: 2, completed: 1 });
  assert.equal(filterAndSearchTasks(items, 'all', '').length, 3);
  assert.equal(filterAndSearchTasks(items, 'active', '').length, 2);
  assert.equal(filterAndSearchTasks(items, 'completed', '').length, 1);
  assert.equal(filterAndSearchTasks(items, 'all', 'BUY').length, 2);
  assert.equal(filterAndSearchTasks(items, 'active', 'buy').length, 1);
  assert.equal(filterAndSearchTasks(items, 'completed', 'report').length, 0);
});

test('isTaskOverdue and formatDueDateLabel handle dates accurately', () => {
  const today = '2026-11-23';
  assert.equal(isTaskOverdue('2026-11-22', false, today), true);
  assert.equal(isTaskOverdue('2026-11-22', true, today), false);
  assert.equal(isTaskOverdue('2026-11-23', false, today), false);
  assert.equal(isTaskOverdue(null, false, today), false);

  assert.equal(formatDueDateLabel('2026-11-23', today), 'Today');
  assert.equal(formatDueDateLabel('2026-11-24', today), 'Tomorrow');
  assert.equal(formatDueDateLabel('2026-11-22', today), 'Yesterday');
  assert.equal(formatDueDateLabel('2026-12-05', today), 'Dec 5');
});

test('localStorage load and save roundtrip preserves empty arrays and handles corrupt JSON', () => {
  const store = new Map<string, string>();
  const mockStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => {
      store.set(k, v);
    },
  };

  // First visit returns seed tasks
  const seed: TodoItem[] = [
    { id: 's1', title: 'Seed task', completed: false, priority: 'medium', dueDate: null, createdAt: 1 },
  ];
  assert.deepEqual(loadTasksFromStorage(mockStorage, seed), seed);

  // Saving empty list persists empty list (does not re-seed on reload)
  saveTasksToStorage(mockStorage, []);
  assert.deepEqual(loadTasksFromStorage(mockStorage, seed), []);

  // Corrupt JSON falls back safely to seed
  mockStorage.setItem(STORAGE_KEY, '{not-valid-json');
  assert.deepEqual(loadTasksFromStorage(mockStorage, seed), seed);
});
