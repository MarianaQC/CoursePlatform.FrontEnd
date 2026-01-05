import { Course } from '@/types/api';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  BookOpen,
  Calendar,
  Edit,
  Eye,
  Globe,
  GlobeLock,
  MoreVertical,
  Trash,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface CourseCardProps {
  course: Course;
  isAdmin: boolean;
  onPublish: (id: string) => void;
  onUnpublish: (id: string) => void;
  onDelete: (id: string) => void;
  onHardDelete: (id: string) => void;
}

export function CourseCard({
  course,
  isAdmin,
  onPublish,
  onUnpublish,
  onDelete,
  onHardDelete,
}: CourseCardProps) {
  const navigate = useNavigate();

  const formattedDate = formatDistanceToNow(new Date(course.updatedAt), {
    addSuffix: true,
    locale: es,
  });

  return (
    <Card className="group transition-all hover:shadow-md animate-fade-in">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          <StatusBadge status={course.status} className="mt-2" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Menú</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/courses/${course.id}`)}>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/courses/${course.id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            {course.status === 'Draft' && course.lessonCount > 0 && (
              <DropdownMenuItem onClick={() => onPublish(course.id)}>
                <Globe className="mr-2 h-4 w-4" />
                Publicar
              </DropdownMenuItem>
            )}
            {course.status === 'Published' && (
              <DropdownMenuItem onClick={() => onUnpublish(course.id)}>
                <GlobeLock className="mr-2 h-4 w-4" />
                Despublicar
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(course.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
            {isAdmin && (
              <DropdownMenuItem
                onClick={() => onHardDelete(course.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar permanentemente
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>
              {course.lessonCount} {course.lessonCount === 1 ? 'lección' : 'lecciones'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
