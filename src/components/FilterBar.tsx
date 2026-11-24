import { Search, X } from 'lucide-react';
import type { FilterTab, TaskCounts } from '../types/todo';

interface FilterBarProps {
  activeFilter: FilterTab;
  onFilterChange: (filter: FilterTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  counts: TaskCounts;
}

const FILTER_OPTIONS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
];

export function FilterBar({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  counts,
}: FilterBarProps) {
  const getTabCount = (id: FilterTab): number => {
    if (id === 'all') return counts.total;
    if (id === 'active') return counts.active;
    return counts.completed;
  };

  return (
    <div className="px-5 py-3.5 sm:px-7 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white">
      <div
        role="tablist"
        aria-label="Filter tasks"
        className="grid grid-cols-3 sm:inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-full sm:w-auto"
      >
        {FILTER_OPTIONS.map((option) => {
          const isSelected = activeFilter === option.id;
          const tabCount = getTabCount(option.id);
          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onFilterChange(option.id)}
              className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 min-h-[36px] text-xs font-semibold rounded-md transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                isSelected
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{option.label}</span>
              <span
                className={`font-mono-tabular text-[11px] ${
                  isSelected ? 'text-blue-600' : 'text-slate-400'
                }`}
              >
                {tabCount}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative w-full sm:w-64">
        <label htmlFor="task-search-input" className="sr-only">
          Search tasks
        </label>
        <Search
          className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          aria-hidden="true"
        />
        <input
          id="task-search-input"
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="w-full h-10 pl-9 pr-8 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-lg transition-colors focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25 focus-visible:border-blue-600 [&::-webkit-search-cancel-button]:hidden"
        />
        {searchQuery.length > 0 && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 inline-flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
