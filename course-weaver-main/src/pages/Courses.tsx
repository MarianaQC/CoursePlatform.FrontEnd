import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { CourseFilters } from '@/components/courses/CourseFilters';
import { CourseCard } from '@/components/courses/CourseCard';
import { Pagination } from '@/components/Pagination';
import { EmptyState } from '@/components/EmptyState';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { courseService } from '@/services/course-service';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Course, PaginatedResponse } from '@/types/api';
import { BookOpen, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [pagination, setPagination] = useState<Omit<PaginatedResponse<Course>, 'items'>>({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    courseId: string;
    courseTitle: string;
    isHard: boolean;
  }>({ open: false, courseId: '', courseTitle: '', isHard: false });
  const [isDeleting, setIsDeleting] = useState(false);

  // Filters from URL
  const searchQuery = searchParams.get('q') || '';
  const statusFilter = searchParams.get('status') || 'all';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await courseService.search({
        q: searchQuery || undefined,
        status: statusFilter === 'all' ? undefined : (statusFilter as 'Draft' | 'Published'),
        page,
        pageSize,
      });

      if (response.success && response.data) {
        setCourses(response.data.items);
        setPagination({
          page: response.data.page,
          pageSize: response.data.pageSize,
          totalCount: response.data.totalCount,
          totalPages: response.data.totalPages,
          hasPreviousPage: response.data.hasPreviousPage,
          hasNextPage: response.data.hasNextPage,
        });
      } else {
        setError(response.message || 'Error al cargar los cursos');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter, page, pageSize]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchCourses();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [fetchCourses]);

  const updateSearchParams = (updates: Record<string, string | number>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        newParams.set(key, value.toString());
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  const handleSearchChange = (value: string) => {
    updateSearchParams({ q: value, page: 1 });
  };

  const handleStatusChange = (value: string) => {
    updateSearchParams({ status: value, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    updateSearchParams({ page: newPage });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    updateSearchParams({ pageSize: newPageSize, page: 1 });
  };

  const handlePublish = async (id: string) => {
    try {
      const response = await courseService.publish(id);
      if (response.success) {
        toast({ title: 'Curso publicado correctamente' });
        fetchCourses();
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
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      const response = await courseService.unpublish(id);
      if (response.success) {
        toast({ title: 'Curso despublicado correctamente' });
        fetchCourses();
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
    }
  };

  const handleDeleteClick = (id: string, isHard: boolean) => {
    const course = courses.find((c) => c.id === id);
    if (course) {
      setDeleteDialog({
        open: true,
        courseId: id,
        courseTitle: course.title,
        isHard,
      });
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const response = deleteDialog.isHard
        ? await courseService.hardDelete(deleteDialog.courseId)
        : await courseService.delete(deleteDialog.courseId);

      if (response.success) {
        toast({
          title: deleteDialog.isHard
            ? 'Curso eliminado permanentemente'
            : 'Curso eliminado correctamente',
        });
        setDeleteDialog({ open: false, courseId: '', courseTitle: '', isHard: false });
        fetchCourses();
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
        description: 'No se pudo eliminar el curso',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Cursos</h1>
          <p className="text-muted-foreground">Gestiona tus cursos y lecciones</p>
        </div>

        <CourseFilters
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
        />

        {isLoading ? (
          <LoadingSpinner className="py-16" text="Cargando cursos..." />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-destructive mb-4">{error}</p>
            <Button variant="outline" onClick={fetchCourses}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reintentar
            </Button>
          </div>
        ) : courses.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title={searchQuery || statusFilter !== 'all'
              ? 'No se encontraron cursos'
              : 'No hay cursos creados'}
            description={
              searchQuery || statusFilter !== 'all'
                ? 'Intenta con otros criterios de búsqueda'
                : '¡Crea el primero para empezar!'
            }
            actionLabel="Crear nuevo curso"
            onAction={() => navigate('/courses/new')}
          />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isAdmin={isAdmin}
                  onPublish={handlePublish}
                  onUnpublish={handleUnpublish}
                  onDelete={(id) => handleDeleteClick(id, false)}
                  onHardDelete={(id) => handleDeleteClick(id, true)}
                />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <Pagination
                page={pagination.page}
                pageSize={pagination.pageSize}
                totalCount={pagination.totalCount}
                totalPages={pagination.totalPages}
                hasPreviousPage={pagination.hasPreviousPage}
                hasNextPage={pagination.hasNextPage}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog((prev) => ({ ...prev, open }))
        }
        title={
          deleteDialog.isHard
            ? '⚠️ Eliminar permanentemente'
            : '¿Eliminar curso?'
        }
        description={
          deleteDialog.isHard
            ? 'Esta acción NO se puede deshacer. El curso y todas sus lecciones serán eliminados para siempre.'
            : `El curso "${deleteDialog.courseTitle}" será eliminado. Esta acción se puede deshacer.`
        }
        confirmText={deleteDialog.isHard ? 'Eliminar permanentemente' : 'Eliminar'}
        variant="destructive"
        requireConfirmation={deleteDialog.isHard ? deleteDialog.courseTitle : undefined}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </MainLayout>
  );
}
