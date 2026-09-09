import type { EntityDto } from '@abp/ng.core';

export interface ChatContactDto {
  id?: string;
  name?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  userId?: string;
  userName?: string;
  userImageUrl?: string;
  groupId?: string;
  groupName?: string;
  groupImageUrl?: string;
  isGroup: boolean;
  unreadCount: number;
}

export interface ChatMessageDto {
  id?: string;
  text?: string;
  senderId?: string;
  senderName?: string;
  logoUrl?: string;
  receiverId?: string;
  groupId?: string;
  sentAt?: string;
  lastModifiedAt?: string;
  isReadByAll: boolean;
  isInstructor: boolean;
}

export interface ChatMessageReportDto extends EntityDto<string> {
  messageId?: string;
  messageText?: string;
  senderId?: string;
  senderName?: string;
  reporterId?: string;
  reporterName?: string;
  reason?: string;
  details?: string;
  status: number;
  creationTime?: string;
}
