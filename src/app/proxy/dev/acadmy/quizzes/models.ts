import type { QuestionAnswerInfoDto, QuestionDetailesDto, QuestionWithAnswersDto } from '../questions/models';
import type { EntityDto } from '@abp/ng.core';

export interface QuizInfoDto {
  quizId?: string;
  title?: string;
  questionsCount: number;
  quizTryCount: number;
  tryedCount: number;
  isSucces: boolean;
  alreadyAnswer: boolean;
}

export interface QuizWithQuestionsDto {
  id?: string;
  title?: string;
  questions: QuestionWithAnswersDto[];
}

export interface AnswerResultDto {
  answerId?: string;
  answerText?: string;
  selectText?: string;
  isCorrect: boolean;
  isSelected: boolean;
}

export interface CreateUpdateQuizDto {
  createrId?: string;
  title?: string;
  description?: string;
  quizTime: number;
  quizTryCount: number;
  lectureId?: string;
}

export interface LectureQuizResultDto {
  lectureId?: string;
  lectureTitle?: string;
  quizzes: QuizResultDetailDto[];
}

export interface QuestionResultDto {
  questionId?: string;
  questionText?: string;
  scoreObtained: number;
  scoreTotal: number;
  logoUrl?: string;
  answers: AnswerResultDto[];
}

export interface QuizAnswerDto {
  quizId?: string;
  answers: QuestionAnswerInfoDto[];
}

export interface QuizDetailsDto {
  quizId?: string;
  title?: string;
  quizTime: number;
  quizTryCount: number;
  questions: QuestionDetailesDto[];
}

export interface QuizDto extends EntityDto<string> {
  title?: string;
  description?: string;
  quizTime: number;
  quizTryCount: number;
  leactureName?: string;
}

export interface QuizResultDetailDto {
  quizId?: string;
  quizTitle?: string;
  studentScore: number;
  totalScore: number;
  quizSuccesRate: number;
  questions: QuestionResultDto[];
}

export interface QuizResultDto {
  quizId?: string;
  totalScore: number;
  studentScore: number;
  myTryCount: number;
  lectureTryCount: number;
  succesRatings: number;
  isSuccesful: boolean;
}
