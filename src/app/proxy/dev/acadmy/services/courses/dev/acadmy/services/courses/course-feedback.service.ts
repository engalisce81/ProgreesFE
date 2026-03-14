import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateCourseFeedbackDto } from '../../../../../../dtos/request/courses/models';
import type { FeedbackDto } from '../../../../../../dtos/response/courses/models';
import type { ResponseApi } from '../../../../../../response/models';

@Injectable({
  providedIn: 'root',
})
export class CourseFeedbackService {
  apiName = 'Default';
  

  acceptFeedback = (id: string, isAccept: boolean, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<boolean>>({
      method: 'POST',
      url: `/api/app/course-feedback/${id}/accept-feedback`,
      params: { isAccept },
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateCourseFeedbackDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<boolean>>({
      method: 'POST',
      url: '/api/app/course-feedback',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<boolean>>({
      method: 'DELETE',
      url: `/api/app/course-feedback/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getFeedbacksByCourseIdByCourseIdAndPageNumberAndPageSizeAndIsAccept = (courseId: string, pageNumber: number, pageSize: number, isAccept: boolean, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<FeedbackDto>>({
      method: 'GET',
      url: `/api/app/course-feedback/feedbacks-by-course-id/${courseId}`,
      params: { pageNumber, pageSize, isAccept },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateCourseFeedbackDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<boolean>>({
      method: 'PUT',
      url: `/api/app/course-feedback/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
