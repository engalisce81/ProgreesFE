import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { PaymobTopUpInputDto } from '../dtos/request/wallets/models';
import type { PaymobPaymentResponseDto, WalletTransactionDto } from '../dtos/response/wallets/models';
import type { ContentResult } from '../../../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  apiName = 'Default';
  

  getMyBalance = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, number>({
      method: 'GET',
      url: '/api/app/wallet/my-balance',
    },
    { apiName: this.apiName,...config });
  

  getMyTransactions = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<WalletTransactionDto>>({
      method: 'GET',
      url: '/api/app/wallet/my-transactions',
    },
    { apiName: this.apiName,...config });
  

  handlePaymobResponseCallback = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ContentResult>({
      method: 'POST',
      url: '/api/app/wallet/paymob/callback',
    },
    { apiName: this.apiName,...config });
  

  initiatePaymobTopUp = (input: PaymobTopUpInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PaymobPaymentResponseDto>({
      method: 'POST',
      url: '/api/app/wallet/paymob/top-up',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
