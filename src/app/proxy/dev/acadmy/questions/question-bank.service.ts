import type { CreateUpdateQuestionBankDto, QuestionBankDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { LookupDto } from '../look-up/models';
import type { ResponseApi } from '../response/models';

@Injectable({
  providedIn: 'root',
})
export class QuestionBankService {
  apiName = 'Default';
  

  create = (input: CreateUpdateQuestionBankDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<QuestionBankDto>>({
      method: 'POST',
      url: '/api/app/question-bank',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/question-bank/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<QuestionBankDto>>({
      method: 'GET',
      url: `/api/app/question-bank/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (pageNumber: number, pageSize: number, search: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<QuestionBankDto>>({
      method: 'GET',
      url: '/api/app/question-bank',
      params: { pageNumber, pageSize, search },
    },
    { apiName: this.apiName,...config });
  

  getListMyBank = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LookupDto>>({
      method: 'GET',
      url: '/api/app/question-bank/my-bank',
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateQuestionBankDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<QuestionBankDto>>({
      method: 'PUT',
      url: `/api/app/question-bank/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
