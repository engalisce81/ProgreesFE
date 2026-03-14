import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ExamQuestionsDto, ExamService } from '@proxy/dev/acadmy/exams';

@Component({
  selector: 'app-bank-question',
  imports: [ReactiveFormsModule],
  templateUrl: './bank-question.component.html',
  styleUrl: './bank-question.component.scss'
})
export class BankQuestionComponent {
  bankId!: string;
  examId!: string;

  questions: ExamQuestionsDto[] = [];
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('bankId'); // ✅ خذ bankId من الـ route
      const examId = params.get('examId'); // ✅ خذ bankId من الـ route

      if (id) {
        this.bankId = id;
        this.examId=examId;
        this.loadQuestions();
      }
    });
  }

  loadQuestions() {
  this.loading = true;

  // التحقق من القيم: إذا كان البنك موجود أرسله في مصفوفة، وإلا أرسل null
  const banksParam = this.bankId ? [this.bankId] : null;
  
  // التحقق من الامتحان: إذا كان موجوداً أرسله، وإلا أرسل null (أو قيمة افتراضية)
  const examParam = this.examId ? this.examId : "3fa85f64-5717-4562-b3fc-2c963f66afa6";

  // ملاحظة: قمت باستبدال المعرف الثابت (Hardcoded ID) بـ examParam
  this.examService.getQuestionsFromBank(banksParam, examParam).subscribe({
    next: (res) => {
      this.questions = res.items || [];
      this.loading = false;
    },
    error: (err) => {
      console.error('Error loading questions:', err);
      this.loading = false;
    }
  });
}
}
