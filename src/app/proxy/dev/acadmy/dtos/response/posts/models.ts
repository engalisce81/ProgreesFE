import type { AuditedEntityDto } from '@abp/ng.core';

export interface CommentDto extends AuditedEntityDto<string> {
  postId?: string;
  userId?: string;
  text?: string;
  userName?: string;
  logoUrl?: string;
}

export interface PostDto extends AuditedEntityDto<string> {
  title?: string;
  content?: string;
  isGeneral: boolean;
  authorName?: string;
  logoUrl?: string;
  totalCommentsCount: number;
  reactionsSummaries: ReactionSummaryDto[];
}

export interface ReactionSummaryDto {
  type: number;
  count: number;
}
