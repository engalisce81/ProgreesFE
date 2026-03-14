import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateReportDto } from '../dtos/request/reports/models';
import type { ReportDto } from '../dtos/response/reports/models';
import type { ResponseApi } from '../response/models';

@Injectable({
  providedIn: 'root',
})
export class UserReportService {
  apiName = 'Default';
  

  create = (input: CreateUpdateReportDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<ReportDto>>({
      method: 'POST',
      url: '/api/app/user-report',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/user-report/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<ReportDto>>({
      method: 'GET',
      url: `/api/app/user-report/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (type: number, status: number, pageNumber: number, pageSize: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ReportDto>>({
      method: 'GET',
      url: '/api/app/user-report',
      params: { type, status, pageNumber, pageSize },
    },
    { apiName: this.apiName,...config });
  

  getMyReports = (pageNumber: number, pageSize: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ReportDto>>({
      method: 'GET',
      url: '/api/app/user-report/my-reports',
      params: { pageNumber, pageSize },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateReportDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<ReportDto>>({
      method: 'PUT',
      url: `/api/app/user-report/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });
  

  updateStatus = (id: string, status: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<ReportDto>>({
      method: 'PUT',
      url: `/api/app/user-report/${id}/status`,
      params: { status },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
