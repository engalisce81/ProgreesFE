import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseCoreModule } from '@abp/ng.core';
import { LectureWithQuizzesDto, LectureService, QuizService } from '@proxy/dev/acadmy/lectures';
import { QuestionService, QuestionWithAnswersDto } from '@proxy/dev/acadmy/questions';
import { MediaItemService } from '@proxy/dev/acadmy/media-items/media-item.service';
import { LookupDto } from '@proxy/dev/acadmy/look-up';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list-quiz',
  standalone: true,
  imports: [ReactiveFormsModule, BaseCoreModule],
  templateUrl: './list-quiz.component.html',
  styleUrl: './list-quiz.component.scss'
})
export class ListQuizComponent implements OnInit {
  refId!: string;
  lecture?: LectureWithQuizzesDto;
  loading = false;
  isCourse=true;
  // Modal Control
  activeModal: 'none' | 'delete' | 'quizForm' | 'questionForm' = 'none';
  isEditMode = false;
  selectedId?: string;

  // Forms
  quizForm!: FormGroup;
  questionForm!: FormGroup;
  
  // Data for Lookups
  questionTypes: LookupDto[] = [];
  questionBanks: LookupDto[] = []; // إضافة قائمة بنوك الأسئلة
  selectedFile?: File;
  confirmData: any = {};

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private lectureService: LectureService,
    private quizService: QuizService,
    private questionService: QuestionService,
    private mediaService: MediaItemService
  ) {
    this.initForms();
  }

  ngOnInit(): void {
  // نضع كل شيء داخل الاشتراك لضمان ترتيب التنفيذ
  this.route.queryParamMap.subscribe(params => {
    const isCourseParam = params.get('isCourse');
    this.isCourse = isCourseParam === 'true';

    // الآن نأتي بالـ ID بناءً على القيمة الصحيحة لـ isCourse
    this.refId = this.isCourse 
      ? this.route.snapshot.paramMap.get('courseId') 
      : this.route.snapshot.paramMap.get('lectureId');

    // إعادة تهيئة الفورم بالقيم الجديدة
    this.initForms();
    
    // تحميل البيانات
    if (this.refId) {
      this.loadLecture();
    }
    this.loadQuestionTypes();
    this.loadQuestionBanks();
  });
}

  initForms() {
    this.quizForm = this.fb.group({
      title: ['', Validators.required],
      description: [''], // إضافة حقل الوصف
      quizTime: [1, [Validators.required, Validators.min(1)]],
      quizTryCount: [1, [Validators.required, Validators.min(1)]],
      lectureId: [this.isCourse? null : this.refId],
      courseId:[this.isCourse? this.refId : null]
    });

    this.questionForm = this.fb.group({
      title: ['', Validators.required],
      questionTypeId: ['', Validators.required],
      questionBankId: [''], // إضافة حقل بنك الأسئلة
      quizId: [''],
      score: [1, Validators.required],
      logoUrl: [''],
      answers: this.fb.array([])
    });
  }

  loadLecture() {
    this.loading = true;
    this.lectureService.getLectureWithQuizzes(this.refId,this.isCourse).subscribe({
      next: (res) => { 
        this.lecture = res.data; 
        this.loading = false; 
      },
      error: () => this.loading = false
    });
  }

  loadQuestionTypes() {
    this.questionService.getListQuestionTypes().subscribe({
      next: (res) => this.questionTypes = res.items
    });
  }

  loadQuestionBanks() {
    this.questionService.getListQuestionBanks().subscribe({
      next: (res) => this.questionBanks = res.items
    });
  }

  // --- Quiz Actions ---
  openQuizForm(quiz?: any) {
    this.isEditMode = !!quiz;
    this.selectedId = quiz?.id;
    this.activeModal = 'quizForm';
    if (quiz) {
      // التعديل يشمل الـ description
      this.quizForm.patchValue({
        title: quiz.title,
        description: quiz.description,
        quizTime: quiz.quizTime,
        quizTryCount: quiz.quizTryCount,
        lectureId: this.isCourse?null: this.refId,
        courseId :this.isCourse? this.refId : null
      });
    } else {
      this.quizForm.reset({ lectureId: this.isCourse? null: this.refId , courseId:this.isCourse? this.refId : null, quizTime: 1, quizTryCount: 1, description: '' });
    }
  }

  submitQuiz() {
    if (this.quizForm.invalid) return;
    this.loading = true;

    const request$ = (this.isEditMode 
      ? this.quizService.update(this.selectedId!, this.quizForm.value)
      : this.quizService.create(this.quizForm.value)) as Observable<any>;

    request$.subscribe({
      next: () => { 
        this.closeModal(); 
        this.loadLecture(); 
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  // --- Question Actions ---
  get answers() { return this.questionForm.get('answers') as FormArray; }

  addAnswer(answer = '', isCorrect = false) {
    this.answers.push(this.fb.group({ 
      answer: [answer, Validators.required], 
      isCorrect: [isCorrect] 
    }));
  }

  removeAnswer(index: number) { this.answers.removeAt(index); }

  openQuestionForm(quizId: string, question?: any) {
    this.isEditMode = !!question;
    this.selectedId = question?.id;
    this.activeModal = 'questionForm';
    this.answers.clear();
    
    if (question) {
      // التعديل يشمل الـ questionBankId
      this.questionForm.patchValue({
        title: question.title,
        questionTypeId: question.questionTypeId,
        questionBankId: question.questionBankId,
        quizId: quizId,
        score: question.score,
        logoUrl: question.logoUrl
      });
      question.answers.forEach((a: any) => this.addAnswer(a.answer, a.isCorrect));
    } else {
      this.questionForm.reset({ quizId, score: 1, questionBankId: '' });
      this.addAnswer(); 
    }
  }

  onFileSelected(event: any) { 
    this.selectedFile = event.target.files[0]; 
  }

  submitQuestion() {
    if (this.questionForm.invalid) return;
    this.loading = true;
    
    if (this.selectedFile) {
      this.mediaService.uploadImage(this.selectedFile).subscribe({
        next: (res) => {
          this.questionForm.patchValue({ logoUrl: res.data });
          this.saveQuestion();
        },
        error: () => this.saveQuestion()
      });
    } else {
      this.questionForm.patchValue({ logoUrl: "" });
      this.saveQuestion();
    }
  }

  private saveQuestion() {
    const request$ = (this.isEditMode 
      ? this.questionService.update(this.selectedId!, this.questionForm.value)
      : this.questionService.create(this.questionForm.value)) as Observable<any>;

    request$.subscribe({
      next: () => { 
        this.closeModal(); 
        this.loadLecture(); 
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  // --- Shared Actions ---
  initDelete(item: any, type: 'quiz' | 'question') {
    this.confirmData = { id: item.id, type, title: item.title };
    this.activeModal = 'delete';
  }

  confirmDeleteYes() {
    this.loading = true;
    const obs$ = (this.confirmData.type === 'quiz' 
      ? this.quizService.delete(this.confirmData.id)
      : this.questionService.delete(this.confirmData.id)) as Observable<any>;

    obs$.subscribe({
      next: () => { 
        this.closeModal(); 
        this.loadLecture(); 
      },
      error: () => this.loading = false
    });
  }

  closeModal() {
    this.activeModal = 'none';
    this.loading = false;
    this.selectedFile = undefined;
    this.isEditMode = false;
    this.selectedId = undefined;
  }
}