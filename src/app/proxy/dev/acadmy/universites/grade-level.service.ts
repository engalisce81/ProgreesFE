import type { CreateUpdateGradeLevelDto, GradeLevelDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ResponseApi } from '../response/models';

@Injectable({
  providedIn: 'root',
})
export class GradeLevelService {
  apiName = 'Default';
  

  create = (input: CreateUpdateGradeLevelDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<GradeLevelDto>>({
      method: 'POST',
      url: '/api/app/grade-level',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/grade-level/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<GradeLevelDto>>({
      method: 'GET',
      url: `/api/app/grade-level/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (pageNumber: number, pageSize: number, search: string, collegeId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<GradeLevelDto>>({
      method: 'GET',
      url: '/api/app/grade-level',
      params: { pageNumber, pageSize, search, collegeId },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateGradeLevelDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<GradeLevelDto>>({
      method: 'PUT',
      url: `/api/app/grade-level/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
