import type { EntityDto } from '@abp/ng.core';

export interface ReportDto extends EntityDto<string> {
  title?: string;
  description?: string;
  type: number;
  status: number;
  userId?: string;
  userName?: string;
  userEmail?: string;
  creationTime?: string;
  targetEntityId?: string;
}
