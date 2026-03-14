import type { CourseInfoDto, CreateUpdateCourseInfoDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { LookupDto } from '../look-up/models';
import type { ResponseApi } from '../response/models';

@Injectable({
  providedIn: 'root',
})
export class CourseInfoService {
  apiName = 'Default';
  

  create = (input: CreateUpdateCourseInfoDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<CourseInfoDto>>({
      method: 'POST',
      url: '/api/app/course-info',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/course-info/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<CourseInfoDto>>({
      method: 'GET',
      url: `/api/app/course-info/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getCourseInfosList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LookupDto>>({
      method: 'GET',
      url: '/api/app/course-info/course-infos-list',
    },
    { apiName: this.apiName,...config });
  

  getList = (pageNumber: number, pageSize: number, search: string, courseId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CourseInfoDto>>({
      method: 'GET',
      url: '/api/app/course-info',
      params: { pageNumber, pageSize, search, courseId },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateCourseInfoDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<CourseInfoDto>>({
      method: 'PUT',
      url: `/api/app/course-info/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
