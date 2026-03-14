import type { EntityDto } from '@abp/ng.core';

export interface AgoraTokenDto {
  token?: string;
  channelName?: string;
  uid: number;
}

export interface LectureMeetingDto extends EntityDto<string> {
  meetingTitle?: string;
  isActive: boolean;
  requiresApproval: boolean;
  startTime?: string;
}

export interface LectureMeetingMemberDto extends EntityDto<string> {
  lectureMeetingId?: string;
  userId?: string;
  role: number;
  isAllowed: boolean;
  name?: string;
  profilePicture?: string;
}
