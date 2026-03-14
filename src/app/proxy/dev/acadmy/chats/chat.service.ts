import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateChatMessageDto } from '../dtos/request/chats/models';
import type { ChatContactDto, ChatMessageDto } from '../dtos/response/chats/models';
import type { ResponseApi } from '../response/models';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  apiName = 'Default';
  

  deleteMessage = (messageId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<boolean>>({
      method: 'DELETE',
      url: `/api/app/chat/${messageId}`,
    },
    { apiName: this.apiName,...config });
  

  editMessage = (messageId: string, newText: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<ChatMessageDto>>({
      method: 'PUT',
      url: `/api/app/chat/${messageId}`,
      params: { newText },
    },
    { apiName: this.apiName,...config });
  

  getChatHistory = (targetUserId: string, groupId: string, search: string, pageNumber: number, pageSize: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ChatMessageDto>>({
      method: 'GET',
      url: '/api/app/chat/history',
      params: { targetUserId, groupId, search, pageNumber, pageSize },
    },
    { apiName: this.apiName,...config });
  

  getMyContacts = (search: string, pageNumber: number, pageSize: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ChatContactDto>>({
      method: 'GET',
      url: '/api/app/chat/contacts',
      params: { search, pageNumber, pageSize },
    },
    { apiName: this.apiName,...config });
  

  sendMessage = (input: CreateUpdateChatMessageDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<ChatMessageDto>>({
      method: 'POST',
      url: '/api/app/chat/send-message',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
