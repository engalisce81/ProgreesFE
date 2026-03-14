import type { EntityDto } from '@abp/ng.core';
import type { QuizInfoDto, QuizWithQuestionsDto } from '../quizzes/models';

export interface CreateUpdateLectureDto {
  title?: string;
  content?: string;
  youTubeVideoUrl?: string;
  driveVideoUrl?: string;
  chapterId?: string;
  isVisible: boolean;
  quizTime: number;
  quizTryCount: number;
  quizCount: number;
  isFree: boolean;
  isRequiredQuiz: boolean;
  successQuizRate: number;
  telegramVideoUrl?: string;
  pdfUrls: string[];
}

export interface LectureDto extends EntityDto<string> {
  title?: string;
  content?: string;
  hasYouTubeVideo: boolean;
  hasDriveVideo: boolean;
  hasTelegramVideo: boolean;
  telegramVideoUrl?: string;
  youTubeVideoUrl?: string;
  driveVideoUrl?: string;
  chapterId?: string;
  courseId?: string;
  courseName?: string;
  chapterName?: string;
  quizTime: number;
  quizTryCount: number;
  quizCount: number;
  isVisible: boolean;
  isFree: boolean;
  isRequiredQuiz: boolean;
  successQuizRate: number;
  pdfUrls: string[];
  videoUrl?: string;
}

export interface LectureInfoDto {
  lectureId?: string;
  title?: string;
  content?: string;
  hasYouTubeVideo: boolean;
  hasDriveVideo: boolean;
  hasTelegramVideo: boolean;
  telegramVideoUrl?: string;
  isQuizRequired: boolean;
  youTubeVideoUrl?: string;
  driveVideoUrl?: string;
  videoUrl?: string;
  pdfUrls: string[];
  quiz: QuizInfoDto;
}

export interface LectureTryDto {
  myTryCount: number;
  lectureTryCount: number;
  successQuizRate: number;
  myScoreRate: number;
  isSucces: boolean;
}

export interface LectureWithQuizzesDto {
  id?: string;
  title?: string;
  quizzes: QuizWithQuestionsDto[];
}
