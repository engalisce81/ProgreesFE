import type { EntityDto } from '@abp/ng.core';

export interface AdvertisementDto extends EntityDto<string> {
  title?: string;
  imageUrl?: string;
  youTubeVideoUrl?: string;
  driveVideoUrl?: string;
  hasYouTubeVideo: boolean;
  hasDriveVideo: boolean;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  videoUrl?: string;
}
