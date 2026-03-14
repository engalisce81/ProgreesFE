import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateQuestionAnswerDto, QuestionAnswerDto } from '../../dev/acadmy/questions/models';
import type { ResponseApi } from '../../dev/acadmy/response/models';

@Injectable({
  providedIn: 'root',
})
export class QuestionAnswerService {
  apiName = 'Default';
  

  create = (input: CreateUpdateQuestionAnswerDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<QuestionAnswerDto>>({
      method: 'POST',
      url: '/api/app/question-answer',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/question-answer/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<QuestionAnswerDto>>({
      method: 'GET',
      url: `/api/app/question-answer/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (pageNumber: number, pageSize: number, search: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<QuestionAnswerDto>>({
      method: 'GET',
      url: '/api/app/question-answer',
      params: { pageNumber, pageSize, search },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateQuestionAnswerDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<QuestionAnswerDto>>({
      method: 'PUT',
      url: `/api/app/question-answer/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
