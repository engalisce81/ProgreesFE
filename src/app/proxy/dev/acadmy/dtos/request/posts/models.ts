import type { IFormFile } from '../../../../../microsoft/asp-net-core/http/models';

export interface CreateUpdateCommentDto {
  text?: string;
  postId?: string;
}

export interface CreateUpdatePostDto {
  title: string;
  content: string;
  file: IFormFile;
  isGeneral: boolean;
}

export interface CreateUpdateReactionDto {
  postId?: string;
  type: number;
}
