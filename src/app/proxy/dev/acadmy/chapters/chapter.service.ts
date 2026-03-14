import type { ChapterDto, CourseChaptersDto, CreateUpdateChapterDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { LookupDto } from '../look-up/models';
import type { ResponseApi } from '../response/models';

@Injectable({
  providedIn: 'root',
})
export class ChapterService {
  apiName = 'Default';
  

  create = (input: CreateUpdateChapterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<ChapterDto>>({
      method: 'POST',
      url: '/api/app/chapter',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/chapter/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<ChapterDto>>({
      method: 'GET',
      url: `/api/app/chapter/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getChaptersByCourseLookUp = (courseId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LookupDto>>({
      method: 'GET',
      url: `/api/app/chapter/chapters-by-course-look-up/${courseId}`,
    },
    { apiName: this.apiName,...config });
  

  getCourseChapters = (courseId: string, pageNumber: number, pageSize: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CourseChaptersDto>>({
      method: 'GET',
      url: `/api/app/chapter/course-chapters/${courseId}`,
      params: { pageNumber, pageSize },
    },
    { apiName: this.apiName,...config });
  

  getList = (pageNumber: number, pageSize: number, search: string, courseId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ChapterDto>>({
      method: 'GET',
      url: '/api/app/chapter',
      params: { pageNumber, pageSize, search, courseId },
    },
    { apiName: this.apiName,...config });
  

  getListChapters = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LookupDto>>({
      method: 'GET',
      url: '/api/app/chapter/chapters',
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateChapterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<ChapterDto>>({
      method: 'PUT',
      url: `/api/app/chapter/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
