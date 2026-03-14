
export interface PaymobTopUpInputDto {
  amount: number;
  currency: string;
  paymentMethod: number;
  phoneNumber?: string;
  returnUrl?: string;
}
