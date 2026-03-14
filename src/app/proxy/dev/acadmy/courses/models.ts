import type { AuditedEntityDto, EntityDto } from '@abp/ng.core';
import type { CourseChaptersDto } from '../chapters/models';
import type { FeedbackDto } from '../dtos/response/courses/models';

export interface CourseDto extends AuditedEntityDto<string> {
  name?: string;
  title?: string;
  description?: string;
  price: number;
  logoUrl?: string;
  userId?: string;
  rating: number;
  collegeId?: string;
  subjectId?: string;
  questionBankId?: string;
  examId?: string;
  isActive: boolean;
  isLifetime: boolean;
  isPdf: boolean;
  pdfUrl?: string;
  hasYouTubeVideo: boolean;
  hasDriveVideo: boolean;
  youTubeVideoUrl?: string;
  driveVideoUrl?: string;
  durationInDays?: number;
  videoUrl?: string;
  isQuiz: boolean;
  infos: string[];
  gradeLevelName?: string;
  subjectName?: string;
  collegeName?: string;
  unvirsityName?: string;
  userName?: string;
  showSubscriberCount: boolean;
  chapterCount: number;
  lectureCount: number;
  subscriberCount: number;
  chatGroupId?: string;
}

export interface CourseInfoDto extends AuditedEntityDto<string> {
  name?: string;
  courseId?: string;
  courseName?: string;
  showSubscriberCount: boolean;
}

export interface CourseInfoHomeDto {
  id?: string;
  isPdf: boolean;
  pdfUrl?: string;
  isQuiz: boolean;
  name?: string;
  description?: string;
  price: number;
  logoUrl?: string;
  userId?: string;
  userName?: string;
  teacherLogoUrl?: string;
  rating: number;
  collegeId?: string;
  collegeName?: string;
  subjectId?: string;
  showSubscriberCount: boolean;
  subscriberCount: number;
  subjectName?: string;
  gradelevelId?: string;
  gradelevelName?: string;
  alreadyJoin: boolean;
  alreadyRequest: boolean;
  chapterCount: number;
  lectureCount: number;
  hasYouTubeVideo: boolean;
  hasDriveVideo: boolean;
  youTubeVideoUrl?: string;
  driveVideoUrl?: string;
  durationInWeeks?: number;
  videoUrl?: string;
  infos: string[];
  courseChaptersDtos: CourseChaptersDto[];
  feedbacks: FeedbackDto[];
}

export interface CourseStudentDto extends EntityDto<string> {
  userId?: string;
  name?: string;
  email?: string;
  creationTime?: string;
  logoUrl?: string;
  courseId?: string;
  courseName?: string;
  isSubscibe: boolean;
  phoneNumber?: string;
}

export interface CreateUpdateCourseDto {
  name?: string;
  title?: string;
  description?: string;
  price: number;
  logoUrl?: string;
  isActive: boolean;
  isLifetime: boolean;
  durationInDays?: number;
  isPdf: boolean;
  pdfUrl?: string;
  showSubscriberCount: boolean;
  youTubeVideoUrl?: string;
  driveVideoUrl?: string;
  subjectId?: string;
  collegeId?: string;
  isQuiz: boolean;
  infos: string[];
}

export interface CreateUpdateCourseInfoDto {
  name?: string;
  courseId?: string;
}

export interface CreateUpdateCourseStudentDto {
  userId?: string;
  courseId?: string;
  isSubscibe: boolean;
}

export interface CreateUpdateStudentCoursesDto {
  userId?: string;
  courseIds: string[];
}

export interface StudentDegreeByCourseDto {
  userId?: string;
  name?: string;
  logoUrl?: string;
  quizzes: StudentQuizDto[];
}

export interface StudentQuizDto {
  quizName?: string;
  lectureName?: string;
  quizScore: number;
  tryCount: number;
}
