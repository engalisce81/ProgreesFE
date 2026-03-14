import type { CreateUpdateLectureDto, LectureDto, LectureTryDto, LectureWithQuizzesDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { LectureQuizResultDto, QuizAnswerDto, QuizDetailsDto, QuizResultDto } from '../quizzes/models';
import type { ResponseApi } from '../response/models';

@Injectable({
  providedIn: 'root',
})
export class LectureService {
  apiName = 'Default';
  

  correctQuiz = (input: QuizAnswerDto, isExam: boolean, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<QuizResultDto>>({
      method: 'POST',
      url: '/api/app/lecture/correct-quiz',
      params: { isExam },
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateLectureDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<LectureDto>>({
      method: 'POST',
      url: '/api/app/lecture',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/lecture/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<LectureDto>>({
      method: 'GET',
      url: `/api/app/lecture/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getLectureQuizResults = (lectureId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<LectureQuizResultDto>>({
      method: 'GET',
      url: `/api/app/lecture/lecture-quiz-results/${lectureId}`,
    },
    { apiName: this.apiName,...config });
  

  getLectureWithQuizzes = (refId: string, isCourse: boolean, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<LectureWithQuizzesDto>>({
      method: 'GET',
      url: `/api/app/lecture/lecture-with-quizzes/${refId}`,
      params: { isCourse },
    },
    { apiName: this.apiName,...config });
  

  getList = (pageNumber: number, pageSize: number, search: string, chapterId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LectureDto>>({
      method: 'GET',
      url: '/api/app/lecture',
      params: { pageNumber, pageSize, search, chapterId },
    },
    { apiName: this.apiName,...config });
  

  getQuizDetails = (refId: string, isExam: boolean, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<QuizDetailsDto>>({
      method: 'GET',
      url: `/api/app/lecture/quiz-details/${refId}`,
      params: { isExam },
    },
    { apiName: this.apiName,...config });
  

  getUserTryCountByUserIdAndLecIdAndQuizId = (userId: string, lecId: string, quizId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<LectureTryDto>>({
      method: 'GET',
      url: '/api/app/lecture/user-try-count',
      params: { userId, lecId, quizId },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateLectureDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<LectureDto>>({
      method: 'PUT',
      url: `/api/app/lecture/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
