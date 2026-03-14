import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateCommentDto, CreateUpdatePostDto, CreateUpdateReactionDto } from '../dtos/request/posts/models';
import type { CommentDto, PostDto } from '../dtos/response/posts/models';
import type { ResponseApi } from '../response/models';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  apiName = 'Default';
  

  addComment = (input: CreateUpdateCommentDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<CommentDto>>({
      method: 'POST',
      url: '/api/app/post/comment',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdatePostDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<PostDto>>({
      method: 'POST',
      url: '/api/app/post',
      body: input.file,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/post/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteComment = (commentId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/post/comment/${commentId}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<PostDto>>({
      method: 'GET',
      url: `/api/app/post/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getListComment = (postId: string, pageNumber: number, pageSize: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CommentDto>>({
      method: 'GET',
      url: `/api/app/post/comment/${postId}`,
      params: { pageNumber, pageSize },
    },
    { apiName: this.apiName,...config });
  

  getListPost = (isGeneral: boolean, pageNumber: number, pageSize: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<PostDto>>({
      method: 'GET',
      url: '/api/app/post/post',
      params: { isGeneral, pageNumber, pageSize },
    },
    { apiName: this.apiName,...config });
  

  getMyPosts = (pageNumber: number, pageSize: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<PostDto>>({
      method: 'GET',
      url: '/api/app/post/my-posts',
      params: { pageNumber, pageSize },
    },
    { apiName: this.apiName,...config });
  

  toggleReaction = (input: CreateUpdateReactionDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/post/toggle-reaction',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdatePostDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<PostDto>>({
      method: 'PUT',
      url: `/api/app/post/${id}`,
      body: input.file,
    },
    { apiName: this.apiName,...config });
  

  updateComment = (commentId: string, newText: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<CommentDto>>({
      method: 'PUT',
      url: `/api/app/post/comment/${commentId}`,
      params: { newText },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
