import type { CreateUpdateUniversityDto, UniversityDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { LookupDto } from '../look-up/models';
import type { ResponseApi } from '../response/models';

@Injectable({
  providedIn: 'root',
})
export class UniversityService {
  apiName = 'Default';
  

  create = (input: CreateUpdateUniversityDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<UniversityDto>>({
      method: 'POST',
      url: '/api/app/university',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/university/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<UniversityDto>>({
      method: 'GET',
      url: `/api/app/university/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (pageNumber: number, pageSize: number, search: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<UniversityDto>>({
      method: 'GET',
      url: '/api/app/university',
      params: { pageNumber, pageSize, search },
    },
    { apiName: this.apiName,...config });
  

  getUniversitysList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LookupDto>>({
      method: 'GET',
      url: '/api/app/university/universitys-list',
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateUniversityDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<UniversityDto>>({
      method: 'PUT',
      url: `/api/app/university/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
