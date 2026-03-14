import type { EntityDto } from '@abp/ng.core';

export interface PaymobPaymentResponseDto {
  success: boolean;
  paymentKey?: string;
  orderId?: string;
  iframeUrl?: string;
  errorMessage?: string;
}

export interface WalletTransactionDto extends EntityDto<string> {
  amount: number;
  currentBalance: number;
  description?: string;
  externalReference?: string;
  type: number;
  creationTime?: string;
}
