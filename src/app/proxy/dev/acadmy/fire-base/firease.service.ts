import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { FirebaseLoginDto } from '../dtos/request/fire-base/models';

@Injectable({
  providedIn: 'root',
})
export class FireaseService {
  apiName = 'Default';
  

  loginToFirebase = (input: FirebaseLoginDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/firease/login-to-firebase',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
