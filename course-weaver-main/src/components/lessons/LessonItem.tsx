import { Lesson } from '@/types/api';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowDown,
  ArrowUp,
  Edit,
  GripVertical,
  MoreVertical,
  Trash,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LessonItemProps {
  lesson: Lesson;
  isFirst: boolean;
  isLast: boolean;
  isAdmin: boolean;
  isMoving: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onHardDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function LessonItem({
  lesson,
  isFirst,
  isLast,
  isAdmin,
  isMoving,
  onEdit,
  onDelete,
  onHardDelete,
  onMoveUp,
  onMoveDown,
}: LessonItemProps) {
  return (
    <div
      className={cn(
        'group flex items-center gap-3 rounded-lg border bg-card p-4 transition-all hover:shadow-sm animate-fade-in',
        isMoving && 'opacity-50'
      )}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
        {lesson.order}
      </div>

      <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />

      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{lesson.title}</h4>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onMoveUp}
          disabled={isFirst || isMoving}
        >
          <ArrowUp className="h-4 w-4" />
          <span className="sr-only">Subir</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onMoveDown}
          disabled={isLast || isMoving}
        >
          <ArrowDown className="h-4 w-4" />
          <span className="sr-only">Bajar</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Menú</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
            {isAdmin && (
              <DropdownMenuItem
                onClick={onHardDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar permanentemente
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
