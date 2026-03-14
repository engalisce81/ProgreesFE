import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListUniversityComponent } from './list-university/list-university.component';
import { ListCollegeComponent } from './college/list-college/list-college.component';
import { ListGradelevelComponent } from './college/gradeLevel/list-gradelevel/list-gradelevel.component';
import { ListSubjectComponent } from './college/gradeLevel/subject/list-subject/list-subject.component';
import { ListCourseComponent } from './college/gradeLevel/subject/course/list-course/list-course.component';
import { CertificateComponent } from './college/gradeLevel/subject/course/certificate/certificate/certificate.component';
import { ListLectureComponent } from './college/gradeLevel/subject/course/chapter/lecture/list-lecture/list-lecture.component';
import { ListQuizComponent } from './college/gradeLevel/subject/course/chapter/lecture/quiz/list-quiz/list-quiz.component';
import { ListChapterComponent } from './college/gradeLevel/subject/course/chapter/list-chapter/list-chapter.component';
import { CreateCourseComponent } from './college/gradeLevel/subject/course/create-course/create-course.component';
import { DegreeStudentComponent } from './college/gradeLevel/subject/course/degree-student/degree-student.component';
import { ExamQuestionsComponent } from './college/gradeLevel/subject/course/exam/exam-questions/exam-questions.component';
import { ListExamComponent } from './college/gradeLevel/subject/course/exam/list-exam/list-exam.component';
import { ExamParticipantsComponent } from './college/gradeLevel/subject/course/exam/participant/exam-participants/exam-participants.component';
import { ExamResultReviewComponent } from './college/gradeLevel/subject/course/exam/participant/result-review/exam-result-review/exam-result-review.component';
import { ListFeedbackComponent } from './college/gradeLevel/subject/course/list-feedback/list-feedback.component';
import { ListRequestjoinComponent } from './college/gradeLevel/subject/course/list-requestjoin/list-requestjoin.component';
import { ListSubscriberComponent } from './college/gradeLevel/subject/course/list-subscriber/list-subscriber.component';
import { UpdateCourseComponent } from './college/gradeLevel/subject/course/update-course/update-course.component';
import { ListChatComponent } from './college/gradeLevel/subject/course/chat/list-chat/list-chat.component';

const routes: Routes = [
  {path:'',pathMatch:"full",component:ListUniversityComponent},
  {path:':id/colleges',pathMatch:"full",component:ListCollegeComponent},
  {path:':id/colleges/:collegeId/gradeLevels',pathMatch:"full",component:ListGradelevelComponent},
  {path:':id/colleges/:collegeId/gradeLevels/:gradeLevelId/subjects',pathMatch:"full",component:ListSubjectComponent},
  {path:':id/colleges/:collegeId/gradeLevels/:gradeLevelId/subjects/:subjectId/courses',pathMatch:"full",component:ListCourseComponent},


    { path: ':id/colleges/:collegeId/gradeLevels/:gradeLevelId/subjects/:subjectId/courses/:courseId/certificate', component: CertificateComponent }, // تمت إزالة pathMatch الزائدة هنا للتبسيط

  { path: ':id/colleges/:collegeId/gradeLevels/:gradeLevelId/subjects/:subjectId/courses/create', component: CreateCourseComponent },
  { path: ':id/colleges/:collegeId/gradeLevels/:gradeLevelId/subjects/:subjectId/courses/:courseId/update', component: UpdateCourseComponent },
  { path: ':id/colleges/:collegeId/gradeLevels/:gradeLevelId/subjects/:subjectId/courses/:courseId/subscriber', component: ListSubscriberComponent },
  { path: ':id/colleges/:collegeId/gradeLevels/:gradeLevelId/subjects/:subjectId/courses/:courseId/subscriber/degree/:userId', component: DegreeStudentComponent },
  { path: ':id/colleges/:collegeId/gradeLevels/:gradeLevelId/subjects/:subjectId/courses/:courseId/requestjoin', component: ListRequestjoinComponent },
  { path: ':id/colleges/:collegeId/gradeLevels/:gradeLevelId/subjects/:subjectId/courses/:courseId/feedbacks', component: ListFeedbackComponent },
  { path: ':id/colleges/:collegeId/gradeLevels/:gradeLevelId/subjects/:subjectId/courses/:courseId/chapters', component: ListChapterComponent },
  { path: ':id/colleges/:collegeId/gradeLevels/:gradeLevelId/subjects/:subjectId/courses/:courseId/chapters/:chapterId/lectures', component: ListLectureComponent },
  { path: ':id/colleges/:collegeId/gradeLevels/:gradeLevelId/subjects/:subjectId/courses/:courseId/chapters/:chapterId/lectures/:lectureId/quizies', component: ListQuizComponent },

  { path: ':id/colleges/:collegeId/gradeLevels/:gradeLevelId/subjects/:subjectId/courses/:groupId/chats', component:ListChatComponent },


  { path: ':id/colleges/:collegeId/gradeLevels/:gradeLevelId/subjects/:subjectId/courses/:courseId/exams',pathMatch:'full' , component: ListExamComponent },
  { path: ':id/colleges/:collegeId/gradeLevels/:gradeLevelId/subjects/:subjectId/courses/:courseId/exams/:examId/questions', component:ExamQuestionsComponent },
  { path: ':id/colleges/:collegeId/gradeLevels/:gradeLevelId/subjects/:subjectId/courses/:courseId/exams/:examId/students',pathMatch:'full' , component:ExamParticipantsComponent },
  { path: ':id/colleges/:collegeId/gradeLevels/:gradeLevelId/subjects/:subjectId/courses/:courseId/exams/:examId/students/:userId/result',  pathMatch:'full' , component:ExamResultReviewComponent },
  { path: ':id/colleges/:collegeId/gradeLevels/:gradeLevelId/subjects/:subjectId/courses/:courseId/quizies', component: ListQuizComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UniversityRoutingModule { }
