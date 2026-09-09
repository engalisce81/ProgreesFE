import type { IFormFile } from '../../../microsoft/asp-net-core/http/models';

export interface UploadChunkDto {
  uploadId: string;
  chunkIndex: number;
  totalChunks: number;
  chunkData: File;
  refId?: string;
  type?: number;
  originalFileName?: string;
}

export interface UploadVideoDto {
  videoFile: File;
  type: number;
  refId: string;
}
