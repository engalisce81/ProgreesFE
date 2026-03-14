import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LectureService } from '@proxy/dev/acadmy/lectures';
import { QuestionDetailesDto } from '@proxy/dev/acadmy/questions';
import { QuizDetailsDto } from '@proxy/dev/acadmy/quizzes';

@Component({
  selector: 'app-exam-questions',
  templateUrl: './exam-questions.component.html',
  styleUrls: ['./exam-questions.component.scss']
})
export class ExamQuestionsComponent implements OnInit {
  questions: QuestionDetailesDto[] = [];
  quizInfo?: QuizDetailsDto;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private lectureService: LectureService 
  ) {}

  ngOnInit(): void {
    // جلب الـ refId من الـ URL
    const refId = this.route.snapshot.paramMap.get('examId');
    const isExam = true; // بما أن الصفحة للاسئلة الامتحانية

    if (refId) {
      this.loadQuizDetails(refId, isExam);
    }
  }

  loadQuizDetails(refId: string, isExam: boolean) {
    this.loading = true;
    this.lectureService.getQuizDetails(refId, isExam).subscribe({
      next: (res) => {
        this.quizInfo = res.data;
        this.questions = res.data.questions || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching quiz details', err);
        this.loading = false;
      }
    });
  }
}