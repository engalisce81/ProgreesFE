import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateAdvertisementDto } from '../dtos/request/advertisementes/models';
import type { AdvertisementDto } from '../dtos/response/advertisementes/models';
import type { ResponseApi } from '../response/models';

@Injectable({
  providedIn: 'root',
})
export class AdvertisementService {
  apiName = 'Default';
  

  create = (input: CreateUpdateAdvertisementDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<boolean>>({
      method: 'POST',
      url: '/api/app/advertisement',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<boolean>>({
      method: 'DELETE',
      url: `/api/app/advertisement/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<AdvertisementDto>>({
      method: 'GET',
      url: `/api/app/advertisement/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getActiveAd = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<AdvertisementDto>>({
      method: 'GET',
      url: '/api/app/advertisement/active-ad',
    },
    { apiName: this.apiName,...config });
  

  getActiveAdsList = (pageNumber: number = 1, pageSize: number = 10, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<AdvertisementDto>>({
      method: 'GET',
      url: '/api/app/advertisement/active-ads-list',
      params: { pageNumber, pageSize },
    },
    { apiName: this.apiName,...config });
  

  getList = (pageNumber: number = 1, pageSize: number = 10, search?: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<AdvertisementDto>>({
      method: 'GET',
      url: '/api/app/advertisement',
      params: { pageNumber, pageSize, search },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateAdvertisementDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<boolean>>({
      method: 'PUT',
      url: `/api/app/advertisement/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
