import type { PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateUpdateChatMessageDto {
  text?: string;
  receiverId?: string;
  groupId?: string;
}

export interface GetReportsInputDto extends PagedAndSortedResultRequestDto {
  status?: number;
  filter?: string;
}

export interface ReportMessageDto {
  messageId: string;
  reason: string;
  details?: string;
}

export interface UpdateReportStatusDto {
  status: number;
}
