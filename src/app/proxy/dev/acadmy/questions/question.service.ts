import type { CreateUpdateQuestionDto, QuestionDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { LookupDto } from '../look-up/models';
import type { ResponseApi } from '../response/models';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  apiName = 'Default';
  

  create = (input: CreateUpdateQuestionDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<QuestionDto>>({
      method: 'POST',
      url: '/api/app/question',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/question/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<QuestionDto>>({
      method: 'GET',
      url: `/api/app/question/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (pageNumber: number, pageSize: number, search: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<QuestionDto>>({
      method: 'GET',
      url: '/api/app/question',
      params: { pageNumber, pageSize, search },
    },
    { apiName: this.apiName,...config });
  

  getListQuestionBanks = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LookupDto>>({
      method: 'GET',
      url: '/api/app/question/question-banks',
    },
    { apiName: this.apiName,...config });
  

  getListQuestionTypes = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LookupDto>>({
      method: 'GET',
      url: '/api/app/question/question-types',
    },
    { apiName: this.apiName,...config });
  

  getListQuestiones = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LookupDto>>({
      method: 'GET',
      url: '/api/app/question/questiones',
    },
    { apiName: this.apiName,...config });
  

  getListQuizzes = (lecId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LookupDto>>({
      method: 'GET',
      url: `/api/app/question/quizzes/${lecId}`,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateQuestionDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<QuestionDto>>({
      method: 'PUT',
      url: `/api/app/question/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
