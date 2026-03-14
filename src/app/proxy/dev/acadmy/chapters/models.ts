import type { EntityDto } from '@abp/ng.core';
import type { LectureInfoDto } from '../lectures/models';

export interface ChapterDto extends EntityDto<string> {
  name?: string;
  courseId?: string;
  courseName?: string;
  isFree: boolean;
}

export interface CourseChaptersDto {
  chapterId?: string;
  chapterName?: string;
  courseId?: string;
  courseName?: string;
  userId?: string;
  examId?: string;
  userName?: string;
  logoUrl?: string;
  lectureCount: number;
  groupId?: string;
  lectures: LectureInfoDto[];
}

export interface CreateUpdateChapterDto {
  name?: string;
  courseId?: string;
  isFree: boolean;
}
