import type { AuditedEntityDto } from '@abp/ng.core';

export interface CreateUpdateSupportDto {
  faceBook?: string;
  phoneNumber?: string;
  email?: string;
}

export interface SupportDto extends AuditedEntityDto<string> {
  faceBook?: string;
  phoneNumber?: string;
  email?: string;
}
