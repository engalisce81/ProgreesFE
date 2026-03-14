import type { IFormFile } from '../../../microsoft/asp-net-core/http/models';

export interface UploadVideoDto {
  videoFile: File;
  type: number;
  refId: string;
}
