import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { Calendar, Check, Pencil, Trash2, X } from 'lucide-react';
import type { Priority, TodoItem } from '../types/todo';
import { formatDueDateLabel, isTaskOverdue, validateTitle } from '../utils/todoLogic';
import { PriorityBadge } from './PriorityBadge';

interface TaskRowProps {
  task: TodoItem;
  onToggle: (id: string) => void;
  onUpdate: (
    id: string,
    updates: { title: string; dueDate: string | null; priority: Priority }
  ) => void;
  onDelete: (id: string) => void;
}

export function TaskRow({ task, onToggle, onUpdate, onDelete }: TaskRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDueDate, setEditDueDate] = useState(task.dueDate ?? '');
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  const [editError, setEditError] = useState<string | null>(null);

  const overdue = isTaskOverdue(task.dueDate, task.completed);
  const formattedDate = formatDueDateLabel(task.dueDate);

  const startEditing = () => {
    setEditTitle(task.title);
    setEditDueDate(task.dueDate ?? '');
    setEditPriority(task.priority);
    setEditError(null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditTitle(task.title);
    setEditDueDate(task.dueDate ?? '');
    setEditPriority(task.priority);
    setEditError(null);
    setIsEditing(false);
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const valid = validateTitle(editTitle);
    if (!valid) {
      setEditError('Title cannot be empty.');
      return;
    }

    onUpdate(task.id, {
      title: valid,
      dueDate: editDueDate || null,
      priority: editPriority,
    });
    setEditError(null);
    setIsEditing(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      cancelEditing();
    }
  };

  if (isEditing) {
    return (
      <li className="px-5 py-4 sm:px-7 border-b border-slate-200 last:border-b-0 bg-blue-50/30">
        <form
          onSubmit={handleSave}
          onKeyDown={handleKeyDown}
          className="space-y-3"
          noValidate
        >
          <div>
            <label htmlFor={`edit-title-${task.id}`} className="sr-only">
              Edit task title for {task.title}
            </label>
            <input
              id={`edit-title-${task.id}`}
              type="text"
              autoFocus
              value={editTitle}
              onChange={(e) => {
                setEditTitle(e.target.value);
                if (editError && e.target.value.trim().length > 0) {
                  setEditError(null);
                }
              }}
              aria-invalid={editError ? 'true' : 'false'}
              className={`w-full h-10 px-3 text-[15px] text-slate-900 bg-white border rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25 ${
                editError
                  ? 'border-red-500 focus-visible:border-red-600'
                  : 'border-slate-300 focus-visible:border-blue-600'
              }`}
            />
            {editError && (
              <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
                {editError}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5">
                <label
                  htmlFor={`edit-date-${task.id}`}
                  className="text-xs font-medium text-slate-600 whitespace-nowrap"
                >
                  Due date
                </label>
                <input
                  id={`edit-date-${task.id}`}
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="h-9 w-full sm:w-auto px-2.5 text-xs font-mono-tabular text-slate-700 bg-white border border-slate-300 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25 focus-visible:border-blue-600"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5">
                <label
                  htmlFor={`edit-priority-${task.id}`}
                  className="text-xs font-medium text-slate-600 whitespace-nowrap"
                >
                  Priority
                </label>
                <select
                  id={`edit-priority-${task.id}`}
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value as Priority)}
                  className="h-9 w-full sm:w-auto px-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25 focus-visible:border-blue-600"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 sm:ml-auto">
              <button
                type="button"
                onClick={cancelEditing}
                className="inline-flex items-center justify-center gap-1.5 h-10 sm:h-9 px-3.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 h-10 sm:h-9 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1"
              >
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li
      data-testid="task-row"
      data-completed={task.completed ? 'true' : 'false'}
      className="group px-4 py-3.5 sm:px-7 sm:py-4 border-b border-slate-100 last:border-b-0 flex items-start sm:items-center gap-3 hover:bg-slate-50/70 transition-colors duration-150"
    >
      <label className="relative inline-flex items-center justify-center w-10 h-10 -ml-2 -my-1.5 shrink-0 cursor-pointer rounded-lg hover:bg-slate-100 transition-colors">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          aria-label={`Mark "${task.title}" as ${
            task.completed ? 'active' : 'completed'
          }`}
          className="peer absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 m-0"
        />
        <span
          aria-hidden="true"
          className={`pointer-events-none w-5 h-5 rounded-md border flex items-center justify-center transition-colors duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2 ${
            task.completed
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'bg-white border-slate-300 group-hover:border-slate-400'
          }`}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
        </span>
      </label>

      <div className="flex-1 min-w-0 pt-0.5 sm:pt-0">
        <p
          className={`text-[15px] leading-snug font-medium break-words transition-colors duration-150 ${
            task.completed ? 'line-through text-slate-400' : 'text-slate-900'
          }`}
        >
          {task.title}
        </p>

        <div className="mt-1.5 flex flex-wrap items-center gap-2.5">
          <PriorityBadge priority={task.priority} muted={task.completed} />

          {formattedDate && (
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-mono-tabular ${
                overdue
                  ? 'text-red-700 font-medium'
                  : task.completed
                  ? 'text-slate-400'
                  : 'text-slate-500'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>
                {overdue ? `Overdue · ${formattedDate}` : formattedDate}
              </span>
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0 -mr-1">
        <button
          type="button"
          onClick={startEditing}
          aria-label={`Edit "${task.title}"`}
          className="inline-flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <Pencil className="w-4 h-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => onDelete(task.id)}
          aria-label={`Delete "${task.title}"`}
          className="inline-flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
        >
          <Trash2 className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}
