import { useEffect, useMemo, useState } from 'react';
import { CheckCheck } from 'lucide-react';
import type { FilterTab, Priority, TodoItem } from './types/todo';
import {
  clearCompletedTasks,
  createTask,
  deleteTask,
  filterAndSearchTasks,
  getTaskCounts,
  loadTasksFromStorage,
  saveTasksToStorage,
  toggleTask,
  updateTask,
} from './utils/todoLogic';
import { TaskInputForm } from './components/TaskInputForm';
import { FilterBar } from './components/FilterBar';
import { TaskRow } from './components/TaskRow';
import { EmptyState } from './components/EmptyState';

export default function App() {
  const [tasks, setTasks] = useState<TodoItem[]>(() =>
    loadTasksFromStorage(
      typeof window !== 'undefined' ? window.localStorage : null
    )
  );
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    saveTasksToStorage(
      typeof window !== 'undefined' ? window.localStorage : null,
      tasks
    );
  }, [tasks]);

  const counts = useMemo(() => getTaskCounts(tasks), [tasks]);

  const visibleTasks = useMemo(
    () => filterAndSearchTasks(tasks, activeFilter, searchQuery),
    [tasks, activeFilter, searchQuery]
  );

  const handleAddTask = (payload: {
    title: string;
    dueDate: string | null;
    priority: Priority;
  }): boolean => {
    const created = createTask(payload);
    if (!created) return false;
    setTasks((prev) => [created, ...prev]);
    if (activeFilter === 'completed') {
      setActiveFilter('all');
    }
    return true;
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) => toggleTask(prev, id));
  };

  const handleUpdateTask = (
    id: string,
    updates: { title: string; dueDate: string | null; priority: Priority }
  ) => {
    setTasks((prev) => updateTask(prev, id, updates));
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => deleteTask(prev, id));
  };

  const handleClearCompleted = () => {
    setTasks((prev) => clearCompletedTasks(prev));
  };

  const handleResetFilters = () => {
    setActiveFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#F3F5F8] text-slate-900 py-6 px-4 sm:py-12 sm:px-6">
      <main className="max-w-[760px] w-full mx-auto bg-white border border-slate-200 rounded-2xl shadow-[0_12px_32px_-12px_rgba(15,23,42,0.08)] overflow-hidden">
        <header className="px-5 py-5 sm:px-7 sm:py-6 border-b border-slate-200 flex items-start sm:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900">
              Clearlist
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Prioritize tasks, track due dates, and stay organized.
            </p>
          </div>

          <div
            data-testid="live-task-counter"
            aria-live="polite"
            className="text-right shrink-0 pt-0.5 sm:pt-0"
          >
            <div className="text-2xl font-bold font-mono-tabular text-slate-900 leading-none">
              {counts.active}
            </div>
            <div className="mt-1 text-xs font-medium text-slate-500 whitespace-nowrap">
              {counts.active === 1 ? 'task remaining' : 'tasks remaining'}
            </div>
          </div>
        </header>

        <TaskInputForm onAddTask={handleAddTask} />

        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          counts={counts}
        />

        <section aria-label="Tasks">
          {visibleTasks.length > 0 ? (
            <ul className="divide-y divide-slate-100" data-testid="task-list">
              {visibleTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggle={handleToggleTask}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </ul>
          ) : (
            <EmptyState
              totalTasks={counts.total}
              activeFilter={activeFilter}
              searchQuery={searchQuery}
              onResetFilters={handleResetFilters}
            />
          )}
        </section>

        <footer className="px-5 py-3.5 sm:px-7 border-t border-slate-200 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-medium text-slate-500 font-mono-tabular">
            <span>{counts.total} total</span>
            <span className="mx-1.5 text-slate-300" aria-hidden="true">
              ·
            </span>
            <span>{counts.completed} completed</span>
          </div>

          <button
            type="button"
            onClick={handleClearCompleted}
            disabled={counts.completed === 0}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 text-xs font-semibold rounded-lg border transition-colors duration-150 whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer text-slate-700 bg-white border-slate-300 hover:bg-red-50 hover:text-red-700 hover:border-red-200 disabled:hover:bg-white disabled:hover:text-slate-700 disabled:hover:border-slate-300"
          >
            <CheckCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Clear Completed</span>
          </button>
        </footer>
      </main>
    </div>
  );
}
