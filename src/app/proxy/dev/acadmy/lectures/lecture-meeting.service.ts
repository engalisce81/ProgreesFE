import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateLectureMeetingDto } from '../dtos/request/lectures/models';
import type { AgoraTokenDto, LectureMeetingDto, LectureMeetingMemberDto } from '../dtos/response/lectures/models';
import type { ResponseApi } from '../response/models';

@Injectable({
  providedIn: 'root',
})
export class LectureMeetingService {
  apiName = 'Default';
  

  create = (input: CreateUpdateLectureMeetingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<LectureMeetingDto>>({
      method: 'POST',
      url: '/api/app/lecture-meeting',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<boolean>>({
      method: 'DELETE',
      url: `/api/app/lecture-meeting/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LectureMeetingDto>({
      method: 'GET',
      url: `/api/app/lecture-meeting/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getJoinedMembers = (meetingId: string, pageNumber: number, pageSize: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LectureMeetingMemberDto>>({
      method: 'GET',
      url: `/api/app/lecture-meeting/joined-members/${meetingId}`,
      params: { pageNumber, pageSize },
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, lectureId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LectureMeetingDto>>({
      method: 'GET',
      url: '/api/app/lecture-meeting',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount, lectureId },
    },
    { apiName: this.apiName,...config });
  

  getPendingRequests = (meetingId: string, pageNumber: number, pageSize: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LectureMeetingMemberDto>>({
      method: 'GET',
      url: `/api/app/lecture-meeting/pending-requests/${meetingId}`,
      params: { pageNumber, pageSize },
    },
    { apiName: this.apiName,...config });
  

  getToken = (meetingId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<AgoraTokenDto>>({
      method: 'GET',
      url: `/api/app/lecture-meeting/token/${meetingId}`,
    },
    { apiName: this.apiName,...config });
  

  joinRequest = (meetingId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<boolean>>({
      method: 'POST',
      url: `/api/app/lecture-meeting/join-request/${meetingId}`,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateLectureMeetingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<LectureMeetingDto>>({
      method: 'PUT',
      url: `/api/app/lecture-meeting/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });
  

  updateHandleJoinRequest = (memberId: string, approve: boolean, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<boolean>>({
      method: 'PUT',
      url: `/api/app/lecture-meeting/handle-join-request/${memberId}`,
      params: { approve },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
