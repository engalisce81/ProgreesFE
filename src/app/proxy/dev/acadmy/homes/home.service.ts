import type { HomesDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ResponseApi } from '../response/models';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  apiName = 'Default';
  

  getHomeStatistics = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, HomesDto>({
      method: 'GET',
      url: '/api/app/home/home-statistics',
    },
    { apiName: this.apiName,...config });
  

  updateActiveTerm = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<string>>({
      method: 'PUT',
      url: `/api/app/home/${id}/active-term`,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
