import { CheckCircle2, ClipboardList, SearchX } from 'lucide-react';
import type { FilterTab } from '../types/todo';

interface EmptyStateProps {
  totalTasks: number;
  activeFilter: FilterTab;
  searchQuery: string;
  onResetFilters: () => void;
}

export function EmptyState({
  totalTasks,
  activeFilter,
  searchQuery,
  onResetFilters,
}: EmptyStateProps) {
  const hasSearch = searchQuery.trim().length > 0;

  if (totalTasks === 0) {
    return (
      <div className="px-6 py-14 text-center" data-testid="empty-state">
        <div className="mx-auto w-11 h-11 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mb-3.5">
          <ClipboardList className="w-5 h-5" aria-hidden="true" />
        </div>
        <h2 className="text-base font-semibold text-slate-900">No tasks yet</h2>
        <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
          Add your first task above with an optional due date and priority level to get started.
        </p>
      </div>
    );
  }

  if (hasSearch) {
    return (
      <div className="px-6 py-14 text-center" data-testid="empty-state">
        <div className="mx-auto w-11 h-11 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mb-3.5">
          <SearchX className="w-5 h-5" aria-hidden="true" />
        </div>
        <h2 className="text-base font-semibold text-slate-900">
          No matching tasks
        </h2>
        <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
          Nothing matched <span className="font-medium text-slate-700">&ldquo;{searchQuery.trim()}&rdquo;</span>
          {activeFilter !== 'all' ? ` in ${activeFilter} tasks.` : '.'}
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="mt-4 inline-flex items-center justify-center h-9 px-4 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          Reset filters
        </button>
      </div>
    );
  }

  const isCompletedTab = activeFilter === 'completed';

  return (
    <div className="px-6 py-14 text-center" data-testid="empty-state">
      <div className="mx-auto w-11 h-11 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mb-3.5">
        <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
      </div>
      <h2 className="text-base font-semibold text-slate-900">
        {isCompletedTab ? 'No completed tasks yet' : 'No active tasks'}
      </h2>
      <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
        {isCompletedTab
          ? 'Check off a task to see your finished work here.'
          : 'All current tasks are complete. Add a new task or review completed items.'}
      </p>
      <button
        type="button"
        onClick={onResetFilters}
        className="mt-4 inline-flex items-center justify-center h-9 px-4 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
      >
        View all tasks
      </button>
    </div>
  );
}
