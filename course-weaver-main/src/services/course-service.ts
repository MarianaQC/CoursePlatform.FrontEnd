import { apiClient } from '@/lib/api-client';
import {
  Course,
  CourseSummary,
  CourseSearchParams,
  CreateCourseRequest,
  PaginatedResponse,
  UpdateCourseRequest,
} from '@/types/api';

export const courseService = {
  async search(params: CourseSearchParams) {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.append('q', params.q);
    if (params.status) searchParams.append('status', params.status);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.pageSize) searchParams.append('pageSize', params.pageSize.toString());

    const queryString = searchParams.toString();
    const endpoint = `/courses/search${queryString ? `?${queryString}` : ''}`;
    return apiClient.get<PaginatedResponse<Course>>(endpoint);
  },

  async getById(id: string) {
    return apiClient.get<Course>(`/courses/${id}`);
  },

  async getSummary(id: string) {
    return apiClient.get<CourseSummary>(`/courses/${id}/summary`);
  },

  async create(data: CreateCourseRequest) {
    return apiClient.post<Course>('/courses', data);
  },

  async update(id: string, data: UpdateCourseRequest) {
    return apiClient.put<Course>(`/courses/${id}`, data);
  },

  async publish(id: string) {
    return apiClient.patch<null>(`/courses/${id}/publish`);
  },

  async unpublish(id: string) {
    return apiClient.patch<null>(`/courses/${id}/unpublish`);
  },

  async delete(id: string) {
    return apiClient.delete<null>(`/courses/${id}`);
  },

  async hardDelete(id: string) {
    return apiClient.delete<null>(`/courses/${id}/hard`);
  },
};
