import type { CreateUpdateTeacherDto, TeacherDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ResponseApi } from '../response/models';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  apiName = 'Default';
  

  create = (input: CreateUpdateTeacherDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/teacher',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/teacher/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (userId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<TeacherDto>>({
      method: 'GET',
      url: '/api/app/teacher',
      params: { userId },
    },
    { apiName: this.apiName,...config });
  

  getTeacherList = (pageNumber: number, pageSize: number, search?: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<TeacherDto>>({
      method: 'GET',
      url: '/api/app/teacher/teacher-list',
      params: { pageNumber, pageSize, search },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateTeacherDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: `/api/app/teacher/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
