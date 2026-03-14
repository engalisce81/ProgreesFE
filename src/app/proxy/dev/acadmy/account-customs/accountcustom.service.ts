import type { RegistercustomDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateEmailDto, EmailDto, UpdateEmailDto } from '../emails/models';
import type { LookupAccountDto, LookupDto } from '../look-up/models';
import type { ResponseApi } from '../response/models';

@Injectable({
  providedIn: 'root',
})
export class AccountcustomService {
  apiName = 'Default';
  

  checkCode = (input: UpdateEmailDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<EmailDto>>({
      method: 'POST',
      url: '/api/app/accountcustom/check-code',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  getAccountTypes = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LookupAccountDto>>({
      method: 'GET',
      url: '/api/app/accountcustom/account-types',
    },
    { apiName: this.apiName,...config });
  

  register = (input: RegistercustomDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<LookupDto>>({
      method: 'POST',
      url: '/api/app/accountcustom/register',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  resetPassword = (userId: string, newPassword: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: `/api/app/accountcustom/reset-password/${userId}`,
      params: { newPassword },
    },
    { apiName: this.apiName,...config });
  

  sendNotificationToEmail = (input: CreateEmailDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<EmailDto>>({
      method: 'POST',
      url: '/api/app/accountcustom/send-notification-to-email',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
