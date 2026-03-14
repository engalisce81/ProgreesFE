import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateQuestionAnswerDto {
  answer?: string;
  isCorrect: boolean;
  questionId?: string;
}

export interface CreateUpdateQuestionBankDto {
  name?: string;
}

export interface CreateUpdateQuestionDto {
  title?: string;
  questionTypeId?: string;
  quizId?: string;
  questionBankId?: string;
  score: number;
  logoUrl?: string;
  answers: CreateUpdateQuestionAnswerDto[];
}

export interface QuestionAnswerDto extends EntityDto<string> {
  answer?: string;
  isCorrect: boolean;
  questionId?: string;
  questionTitle?: string;
}

export interface QuestionAnswerPanelDto {
  id?: string;
  answer?: string;
  isCorrect: boolean;
  isSelectedByStudent: boolean;
}

export interface QuestionBankDto extends EntityDto<string> {
  name?: string;
  userId?: string;
  userName?: string;
}

export interface QuestionDto extends EntityDto<string> {
  title?: string;
  questionTypeId?: string;
  questionTypeName?: string;
  quizId?: string;
  quizTitle?: string;
  questionBankId?: string;
  questionBankName?: string;
  score: number;
  logoUrl?: string;
  answers: QuestionAnswerDto[];
}

export interface QuestionWithAnswersDto {
  id?: string;
  title?: string;
  score: number;
  questionTypeId?: string;
  questionTypeName?: string;
  logoUrl?: string;
  answers: QuestionAnswerPanelDto[];
  studentTextAnswer?: string;
  isStudentAnswerCorrect: boolean;
  scoreObtained: number;
}

export interface QuestionAnswerDetailesDto {
  answerId?: string;
  answer?: string;
  isCorrect: boolean;
}

export interface QuestionAnswerInfoDto {
  questionId?: string;
  textAnswer?: string;
  selectedAnswerId?: string;
}

export interface QuestionDetailesDto {
  questionId?: string;
  title?: string;
  score: number;
  questionType?: string;
  questionTypeKey: number;
  logoUrl?: string;
  answers: QuestionAnswerDetailesDto[];
}
