import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateQuizDto, QuizDto } from '../quizzes/models';
import type { ResponseApi } from '../response/models';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  apiName = 'Default';
  

  create = (input: CreateUpdateQuizDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<QuizDto>>({
      method: 'POST',
      url: '/api/app/quiz',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<boolean>>({
      method: 'DELETE',
      url: `/api/app/quiz/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<QuizDto>>({
      method: 'GET',
      url: `/api/app/quiz/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (pageNumber: number, pageSize: number, search: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<QuizDto>>({
      method: 'GET',
      url: '/api/app/quiz',
      params: { pageNumber, pageSize, search },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateQuizDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<QuizDto>>({
      method: 'PUT',
      url: `/api/app/quiz/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
