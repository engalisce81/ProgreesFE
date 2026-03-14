import type { CreateUpdateSupportDto, SupportDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ResponseApi } from '../response/models';

@Injectable({
  providedIn: 'root',
})
export class SupportService {
  apiName = 'Default';
  

  create = (input: CreateUpdateSupportDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<SupportDto>>({
      method: 'POST',
      url: '/api/app/support',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/support/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<SupportDto>>({
      method: 'GET',
      url: `/api/app/support/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (pageNumber: number, pageSize: number, search: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<SupportDto>>({
      method: 'GET',
      url: '/api/app/support',
      params: { pageNumber, pageSize, search },
    },
    { apiName: this.apiName,...config });
  

  getSupport = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<SupportDto>>({
      method: 'GET',
      url: '/api/app/support/support',
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateSupportDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<SupportDto>>({
      method: 'PUT',
      url: `/api/app/support/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
