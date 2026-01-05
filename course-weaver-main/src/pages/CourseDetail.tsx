import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { StatusBadge } from '@/components/StatusBadge';
import { LessonItem } from '@/components/lessons/LessonItem';
import { LessonFormDialog } from '@/components/lessons/LessonFormDialog';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { EmptyState } from '@/components/EmptyState';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { courseService } from '@/services/course-service';
import { lessonService } from '@/services/lesson-service';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { CourseSummary, Lesson } from '@/types/api';
import {
  ArrowLeft,
  Calendar,
  Edit,
  Globe,
  GlobeLock,
  Plus,
  RefreshCw,
  Trash,
  BookOpen,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const [course, setCourse] = useState<CourseSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lesson dialog state
  const [lessonDialog, setLessonDialog] = useState<{
    open: boolean;
    lesson: Lesson | null;
  }>({ open: false, lesson: null });
  const [isLessonSaving, setIsLessonSaving] = useState(false);

  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    lessonId: string;
    lessonTitle: string;
    isHard: boolean;
  }>({ open: false, lessonId: '', lessonTitle: '', isHard: false });
  const [isDeleting, setIsDeleting] = useState(false);

  // Moving state
  const [movingLessonId, setMovingLessonId] = useState<string | null>(null);

  // Publishing state
  const [isPublishing, setIsPublishing] = useState(false);

  const fetchCourse = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await courseService.getSummary(id);

      if (response.success && response.data) {
        setCourse(response.data);
      } else {
        setError(response.message || 'Error al cargar el curso');
      }
    } catch {
      setError('No se pudo conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const handlePublish = async () => {
    if (!id) return;

    setIsPublishing(true);
    try {
      const response = await courseService.publish(id);
      if (response.success) {
        toast({ title: 'Curso publicado correctamente' });
        fetchCourse();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.message || 'El curso debe tener al menos una lección',
        });
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo publicar el curso',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    if (!id) return;

    setIsPublishing(true);
    try {
      const response = await courseService.unpublish(id);
      if (response.success) {
        toast({ title: 'Curso despublicado correctamente' });
        fetchCourse();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.message,
        });
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo despublicar el curso',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleLessonSubmit = async (data: { title: string; order: number }) => {
    if (!id) return;

    setIsLessonSaving(true);
    try {
      const response = lessonDialog.lesson
        ? await lessonService.update(lessonDialog.lesson.id, data)
        : await lessonService.create({ courseId: id, ...data });

      if (response.success) {
        toast({
          title: lessonDialog.lesson
            ? 'Lección actualizada correctamente'
            : 'Lección creada correctamente',
        });
        setLessonDialog({ open: false, lesson: null });
        fetchCourse();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.message || 'No se pudo guardar la lección',
        });
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo conectar con el servidor',
      });
    } finally {
      setIsLessonSaving(false);
    }
  };

  const handleDeleteLesson = async () => {
    setIsDeleting(true);
    try {
      const response = deleteDialog.isHard
        ? await lessonService.hardDelete(deleteDialog.lessonId)
        : await lessonService.delete(deleteDialog.lessonId);

      if (response.success) {
        toast({
          title: deleteDialog.isHard
            ? 'Lección eliminada permanentemente'
            : 'Lección eliminada correctamente',
        });
        setDeleteDialog({ open: false, lessonId: '', lessonTitle: '', isHard: false });
        fetchCourse();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.message,
        });
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar la lección',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMoveUp = async (lessonId: string) => {
    setMovingLessonId(lessonId);
    try {
      const response = await lessonService.moveUp(lessonId);
      if (response.success) {
        fetchCourse();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.message,
        });
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo mover la lección',
      });
    } finally {
      setMovingLessonId(null);
    }
  };

  const handleMoveDown = async (lessonId: string) => {
    setMovingLessonId(lessonId);
    try {
      const response = await lessonService.moveDown(lessonId);
      if (response.success) {
        fetchCourse();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.message,
        });
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo mover la lección',
      });
    } finally {
      setMovingLessonId(null);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <LoadingSpinner className="py-16" text="Cargando curso..." />
      </MainLayout>
    );
  }

  if (error || !course) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-destructive mb-4">{error || 'Curso no encontrado'}</p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate('/courses')}>
              Volver a cursos
            </Button>
            <Button variant="outline" onClick={fetchCourse}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reintentar
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const sortedLessons = [...course.lessons].sort((a, b) => a.order - b.order);
  const maxOrder = sortedLessons.length > 0
    ? Math.max(...sortedLessons.map((l) => l.order))
    : 0;

  return (
    <MainLayout>
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/courses">Cursos</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{course.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/courses')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <StatusBadge status={course.status} />
            </div>
          </div>
        </div>

        {/* Course Info Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>
                    {course.totalLessons} {course.totalLessons === 1 ? 'lección' : 'lecciones'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Última modificación:{' '}
                    {format(new Date(course.lastModified), "d 'de' MMMM 'de' yyyy", {
                      locale: es,
                    })}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/courses/${id}/edit`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                {course.status === 'Draft' ? (
                  <Button
                    onClick={handlePublish}
                    disabled={course.totalLessons === 0 || isPublishing}
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    {isPublishing ? 'Publicando...' : 'Publicar'}
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={handleUnpublish}
                    disabled={isPublishing}
                  >
                    <GlobeLock className="mr-2 h-4 w-4" />
                    {isPublishing ? 'Procesando...' : 'Despublicar'}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lessons Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Lecciones ({course.totalLessons})
            </h2>
            <Button onClick={() => setLessonDialog({ open: true, lesson: null })}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar lección
            </Button>
          </div>

          {course.status === 'Draft' && course.totalLessons === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Agrega al menos una lección para poder publicar este curso.
              </AlertDescription>
            </Alert>
          )}

          {sortedLessons.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="Este curso no tiene lecciones"
              description="Agrega la primera lección para poder publicar el curso"
              actionLabel="Agregar primera lección"
              onAction={() => setLessonDialog({ open: true, lesson: null })}
            />
          ) : (
            <div className="space-y-2">
              {sortedLessons.map((lesson, index) => (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson}
                  isFirst={index === 0}
                  isLast={index === sortedLessons.length - 1}
                  isAdmin={isAdmin}
                  isMoving={movingLessonId === lesson.id}
                  onEdit={() => setLessonDialog({ open: true, lesson })}
                  onDelete={() =>
                    setDeleteDialog({
                      open: true,
                      lessonId: lesson.id,
                      lessonTitle: lesson.title,
                      isHard: false,
                    })
                  }
                  onHardDelete={() =>
                    setDeleteDialog({
                      open: true,
                      lessonId: lesson.id,
                      lessonTitle: lesson.title,
                      isHard: true,
                    })
                  }
                  onMoveUp={() => handleMoveUp(lesson.id)}
                  onMoveDown={() => handleMoveDown(lesson.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <LessonFormDialog
        open={lessonDialog.open}
        onOpenChange={(open) => setLessonDialog((prev) => ({ ...prev, open }))}
        lesson={lessonDialog.lesson}
        defaultOrder={maxOrder + 1}
        onSubmit={handleLessonSubmit}
        isLoading={isLessonSaving}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
        title={
          deleteDialog.isHard
            ? '⚠️ Eliminar permanentemente'
            : '¿Eliminar lección?'
        }
        description={
          deleteDialog.isHard
            ? 'Esta acción NO se puede deshacer. La lección será eliminada para siempre.'
            : `La lección "${deleteDialog.lessonTitle}" será eliminada.`
        }
        confirmText={deleteDialog.isHard ? 'Eliminar permanentemente' : 'Eliminar'}
        variant="destructive"
        requireConfirmation={deleteDialog.isHard ? deleteDialog.lessonTitle : undefined}
        onConfirm={handleDeleteLesson}
        isLoading={isDeleting}
      />
    </MainLayout>
  );
}
