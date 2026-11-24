import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import type { Priority } from '../types/todo';

interface PriorityBadgeProps {
  priority: Priority;
  muted?: boolean;
}

const PRIORITY_STYLES: Record<
  Priority,
  {
    label: string;
    classes: string;
    Icon: typeof ArrowUp;
  }
> = {
  high: {
    label: 'High',
    classes: 'bg-red-50 text-red-700 border-red-200',
    Icon: ArrowUp,
  },
  medium: {
    label: 'Medium',
    classes: 'bg-amber-50 text-amber-800 border-amber-200',
    Icon: Minus,
  },
  low: {
    label: 'Low',
    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Icon: ArrowDown,
  },
};

export function PriorityBadge({ priority, muted = false }: PriorityBadgeProps) {
  const config = PRIORITY_STYLES[priority];
  const Icon = config.Icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md border whitespace-nowrap shrink-0 transition-opacity duration-150 ${
        config.classes
      } ${muted ? 'opacity-55' : ''}`}
    >
      <Icon className="w-3 h-3 shrink-0" aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
}
