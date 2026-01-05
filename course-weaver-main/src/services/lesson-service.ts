import { apiClient } from '@/lib/api-client';
import {
  CreateLessonRequest,
  Lesson,
  ReorderLessonItem,
  UpdateLessonRequest,
} from '@/types/api';

export const lessonService = {
  async getByCourse(courseId: string) {
    return apiClient.get<Lesson[]>(`/lessons/course/${courseId}`);
  },

  async getById(id: string) {
    return apiClient.get<Lesson>(`/lessons/${id}`);
  },

  async create(data: CreateLessonRequest) {
    return apiClient.post<Lesson>('/lessons', data);
  },

  async update(id: string, data: UpdateLessonRequest) {
    return apiClient.put<Lesson>(`/lessons/${id}`, data);
  },

  async delete(id: string) {
    return apiClient.delete<null>(`/lessons/${id}`);
  },

  async hardDelete(id: string) {
    return apiClient.delete<null>(`/lessons/${id}/hard`);
  },

  async moveUp(id: string) {
    return apiClient.patch<null>(`/lessons/${id}/move-up`);
  },

  async moveDown(id: string) {
    return apiClient.patch<null>(`/lessons/${id}/move-down`);
  },

  async reorder(courseId: string, items: ReorderLessonItem[]) {
    return apiClient.post<null>(`/lessons/course/${courseId}/reorder`, items);
  },
};
