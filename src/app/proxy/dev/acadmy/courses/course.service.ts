import type { CourseDto, CourseInfoHomeDto, CreateUpdateCourseDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CourseType } from '../enums/course-type.enum';
import type { LectureWithQuizzesDto } from '../lectures/models';
import type { LookupDto } from '../look-up/models';
import type { ResponseApi } from '../response/models';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  apiName = 'Default';
  

  create = (input: CreateUpdateCourseDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<CourseDto>>({
      method: 'POST',
      url: '/api/app/course',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/course/${id}`,
    },
    { apiName: this.apiName,...config });
  

  duplicateCourse = (courseId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: `/api/app/course/duplicate-course/${courseId}`,
    },
    { apiName: this.apiName,...config });
  

  exploreCourses = (pageNumber: number, pageSize: number, search: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CourseInfoHomeDto>>({
      method: 'POST',
      url: '/api/app/course/explore-courses',
      params: { pageNumber, pageSize, search },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<CourseDto>>({
      method: 'GET',
      url: `/api/app/course/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getCoursesInfo = (courseId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<CourseInfoHomeDto>>({
      method: 'GET',
      url: `/api/app/course/courses-info/${courseId}`,
    },
    { apiName: this.apiName,...config });
  

  getCoursesInfoList = (pageNumber: number, pageSize: number, search: string, alreadyJoin: boolean, collegeId: string, subjectId: string, gradelevelId: string, termId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CourseInfoHomeDto>>({
      method: 'GET',
      url: '/api/app/course/courses-info-list',
      params: { pageNumber, pageSize, search, alreadyJoin, collegeId, subjectId, gradelevelId, termId },
    },
    { apiName: this.apiName,...config });
  

  getCoursesList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LookupDto>>({
      method: 'GET',
      url: '/api/app/course/courses-list',
    },
    { apiName: this.apiName,...config });
  

  getList = (pageNumber: number, pageSize: number, search: string, type: CourseType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CourseDto>>({
      method: 'GET',
      url: '/api/app/course',
      params: { pageNumber, pageSize, search, type },
    },
    { apiName: this.apiName,...config });
  

  getListBySubjectAndCourse = (pageNumber: number, pageSize: number, search: string, type: CourseType, subjectId: string, collegeId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CourseDto>>({
      method: 'GET',
      url: '/api/app/course/by-subject-and-course',
      params: { pageNumber, pageSize, search, type, subjectId, collegeId },
    },
    { apiName: this.apiName,...config });
  

  getMyCoursesLookUp = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LookupDto>>({
      method: 'GET',
      url: '/api/app/course/my-courses-look-up',
    },
    { apiName: this.apiName,...config });
  

  getStudentQuizzesByCourse = (courseId: string, userId: string, pageNumber: number, pageSize: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LectureWithQuizzesDto>>({
      method: 'GET',
      url: '/api/app/course/student-quizzes-by-course',
      params: { courseId, userId, pageNumber, pageSize },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateCourseDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<CourseDto>>({
      method: 'PUT',
      url: `/api/app/course/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
