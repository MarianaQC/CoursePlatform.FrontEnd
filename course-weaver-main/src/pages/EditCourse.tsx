import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { courseService } from '@/services/course-service';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const courseSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es requerido')
    .max(200, 'El título no puede exceder 200 caracteres'),
});

type CourseFormData = z.infer<typeof courseSchema>;

export default function EditCourse() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
    },
  });

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);

      try {
        const response = await courseService.getById(id);

        if (response.success && response.data) {
          form.reset({ title: response.data.title });
        } else {
          setError(response.message || 'Error al cargar el curso');
        }
      } catch {
        setError('No se pudo conectar con el servidor');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id, form]);

  const onSubmit = async (data: CourseFormData) => {
    if (!id) return;

    setIsSaving(true);
    try {
      const response = await courseService.update(id, { title: data.title });
      if (response.success) {
        toast({ title: 'Curso actualizado correctamente' });
        navigate(`/courses/${id}`);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.message || 'No se pudo actualizar el curso',
        });
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo conectar con el servidor',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <LoadingSpinner className="py-16" text="Cargando curso..." />
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-destructive mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reintentar
          </Button>
        </div>
      </MainLayout>
    );
  }

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
              <BreadcrumbLink asChild>
                <Link to={`/courses/${id}`}>{form.getValues('title') || 'Curso'}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Editar</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/courses/${id}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Editar Curso</h1>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Información del curso</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título del curso</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Introducción a JavaScript"
                          {...field}
                        />
                      </FormControl>
                      <div className="flex justify-between">
                        <FormMessage />
                        <span className="text-xs text-muted-foreground">
                          {field.value.length}/200
                        </span>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/courses/${id}`)}
                    disabled={isSaving}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      'Guardar cambios'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
