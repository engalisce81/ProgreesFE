import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { GetReportsInputDto, UpdateReportStatusDto } from '../dtos/request/chats/models';
import type { ChatMessageReportDto } from '../dtos/response/chats/models';
import type { ResponseApi } from '../response/models';

@Injectable({
  providedIn: 'root',
})
export class ChatReportAdminService {
  apiName = 'Default';
  

  deleteReportedMessage = (reportId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<boolean>>({
      method: 'DELETE',
      url: `/api/app/admin/chat-reports/delete-reported-message/${reportId}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<ChatMessageReportDto>>({
      method: 'GET',
      url: `/api/app/admin/chat-reports/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: GetReportsInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ChatMessageReportDto>>({
      method: 'GET',
      url: '/api/app/admin/chat-reports',
      params: { status: input.status, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  updateStatus = (id: string, input: UpdateReportStatusDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<boolean>>({
      method: 'PUT',
      url: `/api/app/admin/chat-reports/${id}/status`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
