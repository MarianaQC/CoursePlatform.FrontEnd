import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lesson } from '@/types/api';

const lessonSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es requerido')
    .max(200, 'El título no puede exceder 200 caracteres'),
  order: z.coerce
    .number()
    .int('El orden debe ser un número entero')
    .min(1, 'El orden debe ser mayor a 0'),
});

type LessonFormData = z.infer<typeof lessonSchema>;

interface LessonFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson?: Lesson | null;
  defaultOrder: number;
  onSubmit: (data: { title: string; order: number }) => Promise<void>;
  isLoading: boolean;
}

export function LessonFormDialog({
  open,
  onOpenChange,
  lesson,
  defaultOrder,
  onSubmit,
  isLoading,
}: LessonFormDialogProps) {
  const isEditing = !!lesson;

  const form = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: '',
      order: defaultOrder,
    },
  });

  useEffect(() => {
    if (open) {
      if (lesson) {
        form.reset({
          title: lesson.title,
          order: lesson.order,
        });
      } else {
        form.reset({
          title: '',
          order: defaultOrder,
        });
      }
    }
  }, [open, lesson, defaultOrder, form]);

  const handleSubmit = async (data: LessonFormData) => {
    await onSubmit({ title: data.title, order: data.order });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar lección' : 'Agregar lección'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título de la lección</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Variables y tipos de datos"
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

            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Posición</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    El orden debe ser único dentro del curso
                  </p>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Guardando...' : isEditing ? 'Guardar' : 'Agregar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
