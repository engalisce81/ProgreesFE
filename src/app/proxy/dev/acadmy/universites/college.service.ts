import type { CollegeDto, CreateUpdateCollegeDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { LookupDto } from '../look-up/models';
import type { ResponseApi } from '../response/models';

@Injectable({
  providedIn: 'root',
})
export class CollegeService {
  apiName = 'Default';
  

  create = (input: CreateUpdateCollegeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<CollegeDto>>({
      method: 'POST',
      url: '/api/app/college',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/college/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<CollegeDto>>({
      method: 'GET',
      url: `/api/app/college/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getCollegesList = (universityId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LookupDto>>({
      method: 'GET',
      url: `/api/app/college/colleges-list/${universityId}`,
    },
    { apiName: this.apiName,...config });
  

  getGradeLevelList = (collegeId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LookupDto>>({
      method: 'GET',
      url: `/api/app/college/grade-level-list/${collegeId}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (pageNumber: number, pageSize: number, search: string, universityId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CollegeDto>>({
      method: 'GET',
      url: '/api/app/college',
      params: { pageNumber, pageSize, search, universityId },
    },
    { apiName: this.apiName,...config });
  

  getTermList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LookupDto>>({
      method: 'GET',
      url: '/api/app/college/term-list',
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateCollegeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<CollegeDto>>({
      method: 'PUT',
      url: `/api/app/college/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
