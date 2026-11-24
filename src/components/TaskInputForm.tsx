import { useRef, useState, type FormEvent } from 'react';
import { Calendar, Flag, Plus } from 'lucide-react';
import type { Priority } from '../types/todo';

interface TaskInputFormProps {
  onAddTask: (payload: {
    title: string;
    dueDate: string | null;
    priority: Priority;
  }) => boolean;
}

export function TaskInputForm({ onAddTask }: TaskInputFormProps) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [error, setError] = useState<string | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const added = onAddTask({
      title,
      dueDate: dueDate || null,
      priority,
    });

    if (!added) {
      setError('Please enter a task title.');
      titleInputRef.current?.focus();
      return;
    }

    setTitle('');
    setDueDate('');
    setPriority('medium');
    setError(null);
    titleInputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="px-5 py-4 sm:px-7 sm:py-5 border-b border-slate-200 bg-slate-50/60"
      noValidate
    >
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="flex-1 min-w-0">
          <label htmlFor="new-task-title" className="sr-only">
            Task title
          </label>
          <input
            ref={titleInputRef}
            id="new-task-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error && e.target.value.trim().length > 0) {
                setError(null);
              }
            }}
            placeholder="Add a new task..."
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'new-task-error' : undefined}
            className={`w-full h-11 px-3.5 text-[15px] text-slate-900 placeholder:text-slate-400 bg-white border rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25 ${
              error
                ? 'border-red-500 focus-visible:border-red-600'
                : 'border-slate-300 focus-visible:border-blue-600'
            }`}
          />
        </div>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 h-11 px-5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Add Task</span>
        </button>
      </div>

      {error && (
        <p
          id="new-task-error"
          role="alert"
          className="mt-2 text-xs font-medium text-red-600"
        >
          {error}
        </p>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:items-center sm:gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
          <label
            htmlFor="new-task-due-date"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 whitespace-nowrap shrink-0"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>Due date</span>
          </label>
          <input
            id="new-task-due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="h-10 sm:h-9 w-full sm:w-[148px] px-2.5 text-xs font-mono-tabular text-slate-700 bg-white border border-slate-300 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25 focus-visible:border-blue-600"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
          <label
            htmlFor="new-task-priority"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 whitespace-nowrap shrink-0"
          >
            <Flag className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>Priority</span>
          </label>
          <select
            id="new-task-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="h-10 sm:h-9 w-full sm:w-[116px] px-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25 focus-visible:border-blue-600"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
    </form>
  );
}
