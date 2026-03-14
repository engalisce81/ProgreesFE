import type { EntityDto } from '@abp/ng.core';

export interface CreateEmailDto {
  emailAdrees?: string;
}

export interface EmailDto extends EntityDto<string> {
  emailAdrees?: string;
  code?: string;
  isAccept: boolean;
}

export interface UpdateEmailDto {
  emailAdrees?: string;
  code?: string;
}
