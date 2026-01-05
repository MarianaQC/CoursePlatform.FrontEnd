// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  expiration: string;
  roles: string[];
}

export interface User {
  email: string;
  fullName: string;
  roles: string[];
}

// Course types
export interface Course {
  id: string;
  title: string;
  status: 'Draft' | 'Published';
  lessonCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseSummary {
  id: string;
  title: string;
  status: 'Draft' | 'Published';
  totalLessons: number;
  lastModified: string;
  lessons: Lesson[];
}

export interface CreateCourseRequest {
  title: string;
}

export interface UpdateCourseRequest {
  title: string;
}

// Lesson types
export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLessonRequest {
  courseId: string;
  title: string;
  order: number;
}

export interface UpdateLessonRequest {
  title: string;
  order: number;
}

export interface ReorderLessonItem {
  lessonId: string;
  newOrder: number;
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CourseSearchParams {
  q?: string;
  status?: 'Draft' | 'Published' | '';
  page?: number;
  pageSize?: number;
}
