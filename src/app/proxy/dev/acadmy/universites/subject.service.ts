import type { CreateUpdateSubjectDto, SubjectDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { LookupDto } from '../look-up/models';
import type { ResponseApi } from '../response/models';

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  apiName = 'Default';
  

  create = (input: CreateUpdateSubjectDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<SubjectDto>>({
      method: 'POST',
      url: '/api/app/subject',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/subject/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<SubjectDto>>({
      method: 'GET',
      url: `/api/app/subject/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (pageNumber: number, pageSize: number, search: string, gradeLevelId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<SubjectDto>>({
      method: 'GET',
      url: '/api/app/subject',
      params: { pageNumber, pageSize, search, gradeLevelId },
    },
    { apiName: this.apiName,...config });
  

  getSubjectsList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LookupDto>>({
      method: 'GET',
      url: '/api/app/subject/subjects-list',
    },
    { apiName: this.apiName,...config });
  

  getSubjectsWithCollegeList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LookupDto>>({
      method: 'GET',
      url: '/api/app/subject/subjects-with-college-list',
    },
    { apiName: this.apiName,...config });
  

  getSubjectsWithCollegeMobList = (collegeId: string, gradelevelId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LookupDto>>({
      method: 'GET',
      url: '/api/app/subject/subjects-with-college-mob-list',
      params: { collegeId, gradelevelId },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateSubjectDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<SubjectDto>>({
      method: 'PUT',
      url: `/api/app/subject/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
