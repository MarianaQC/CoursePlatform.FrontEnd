import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'Draft' | 'Published';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        status === 'Published'
          ? 'bg-success/10 text-success'
          : 'bg-warning/10 text-warning',
        className
      )}
    >
      {status === 'Published' ? 'Publicado' : 'Borrador'}
    </span>
  );
}
