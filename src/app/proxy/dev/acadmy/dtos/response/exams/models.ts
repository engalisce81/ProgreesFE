
export interface ExamAnswerDetailDto {
  questionId?: string;
  questionText?: string;
  questionType?: string;
  logoUrl?: string;
  studentTextAnswer?: string;
  studentSelectedAnswerId?: string;
  correctTextAnswer?: string;
  correctSelectedAnswerId?: string;
  allOptions: ExamQuestionAnswerDto[];
  scoreObtained: number;
  isCorrect: boolean;
  scoreTotal: number;
}

export interface ExamQuestionAnswerDto {
  id?: string;
  answerText?: string;
  isCorrect: boolean;
}

export interface ExamStudentDto {
  examId?: string;
  userId?: string;
  fullName?: string;
  logoUrl?: string;
  score: number;
  tryCount: number;
  isPassed: boolean;
  finishedAt?: string;
  isCertificateIssued: boolean;
}

export interface ExamStudentResultDto {
  examId?: string;
  examTitle?: string;
  studentScore: number;
  examScore: number;
  passScore: number;
  totalQuestions: number;
  isPassed: boolean;
  finishedAt?: string;
  answers: ExamAnswerDetailDto[];
}

export interface ExamStudentStatusDto {
  examId?: string;
  isPassed: boolean;
  score: number;
  isCertificateIssued: boolean;
  canRequestNow: boolean;
  passScore: number;
  totalQuestions: number;
  examTime: number;
  nextAvailableDate?: string;
  finishedAt?: string;
}
