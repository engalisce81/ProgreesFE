
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
