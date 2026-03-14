import type { EntityDto } from '@abp/ng.core';

export interface FeedbackDto extends EntityDto<string> {
  userId?: string;
  rating: number;
  comment?: string;
  userName?: string;
  logoUrl?: string;
}

export interface CourseCertificateDto extends EntityDto<string> {
  courseId?: string;
  templateUrl?: string;
  nameXPosition: number;
  nameYPosition: number;
}
