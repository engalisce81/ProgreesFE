import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExamDto, ExamService, CreateUpdateExamDto, ExamQuestionsDto, CreateUpdateExamQuestionDto } from '@proxy/dev/acadmy/exams';
import { QuestionBankService } from '@proxy/dev/acadmy/questions';
import { LookupDto } from '@proxy/dev/acadmy/look-up';

@Component({
  selector: 'app-list-exam',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './list-exam.component.html',
  styleUrl: './list-exam.component.scss'
})
export class ListExamComponent implements OnInit {
  // البيانات
  exams: ExamDto[] = [];
  examForm!: FormGroup;
  
  // حالات الواجهة
  loading = false;
  submitting = false;
  search = '';
  courseId: string = '';
  
  // التحكم في النوافذ المنبثقة (Modals)
  showForm = false;
  isEditMode = false;
  selectedExamId: string | null = null;
  showDeleteConfirm = false;
  examToDelete: ExamDto | null = null;
  
  // === إدارة الأسئلة ===
  activeTab: 'exams' | 'questions' = 'exams';
  selectedExamForQuestions: ExamDto | null = null;
  banks: LookupDto[] = [];
  selectedBankIds: string[] = [];
  questions: ExamQuestionsDto[] = [];
  loadingQuestions = false;
  
  // حالات التحقق
  get hasSelectedQuestions(): boolean {
    return this.questions.some(q => q.isSelected);
  }

  constructor(
    private examService: ExamService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private bankService: QuestionBankService
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('courseId') || '';
    this.initForm();
    this.loadExams();
    this.loadBanks();
  }

  // === التحميل الأساسي ===
  loadExams() {
    this.loading = true;
    this.examService.getList(1, 100, this.search,this.courseId).subscribe({
      next: (res) => {
        this.exams = res.items;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  loadBanks() {
    this.bankService.getListMyBank().subscribe({
      next: (res) => (this.banks = res.items),
      error: (err) => console.error('Error loading banks:', err)
    });
  }

  // === التحكم في التبويبات ===
  switchTab(tab: 'exams' | 'questions', exam?: ExamDto) {
    this.activeTab = tab;
    if (exam && tab === 'questions') {
      this.selectedExamForQuestions = exam;
      this.loadQuestionsForExam();
    }
  }

  // === إدارة الامتحانات (CRUD) ===
  initForm() {
    this.examForm = this.fb.group({
      name: ['', Validators.required],
      timeExam: [0, [Validators.required, Validators.min(1)]],
      score: [0],
      isActive: [true],
      courseId: [this.courseId],
      passScore:[0],
    });
  }

  openCreateForm() {
    this.isEditMode = false;
    this.showForm = true;
    this.examForm.reset({ 
      isActive: true, 
      timeExam: 0, 
      score: 0, 
      courseId: this.courseId 
    });
  }

  openEditForm(exam: ExamDto) {
    this.isEditMode = true;
    this.selectedExamId = exam.id;
    this.showForm = true;
    this.examForm.patchValue(exam);
  }

  closeForm() {
    this.showForm = false;
    this.selectedExamId = null;
  }

  submit() {
    if (this.examForm.invalid) return;
    this.submitting = true;

    const dto: CreateUpdateExamDto = this.examForm.value;

    const request = this.isEditMode && this.selectedExamId
      ? this.examService.update(this.selectedExamId, dto)
      : this.examService.create(dto);

    request.subscribe({
      next: () => {
        this.submitting = false;
        this.showForm = false;
        this.loadExams();
      },
      error: () => this.submitting = false
    });
  }

  confirmDelete(exam: ExamDto) {
    this.examToDelete = exam;
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.examToDelete = null;
  }

  deleteExam() {
    if (!this.examToDelete) return;
    this.loading = true;
    this.examService.delete(this.examToDelete.id).subscribe({
      next: () => {
        this.showDeleteConfirm = false;
        this.examToDelete = null;
        this.loadExams();
      },
      error: () => this.loading = false
    });
  }

  // === إدارة الأسئلة ===
  loadQuestionsForExam() {
    if (this.selectedBankIds.length === 0) {
      alert('Please select at least one bank.');
      return;
    }

    if (!this.selectedExamForQuestions) return;

    this.loadingQuestions = true;
    this.examService.getQuestionsFromBank(this.selectedBankIds, this.selectedExamForQuestions.id).subscribe({
      next: (res) => {
        this.questions = res.items;
        this.loadingQuestions = false;
      },
      error: (err) => {
        this.loadingQuestions = false;
        alert('Error loading questions: ' + err.message);
      }
    });
  }

  onBankChecked(event: any, bankId: string) {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.selectedBankIds.push(bankId);
    } else {
      this.selectedBankIds = this.selectedBankIds.filter(id => id !== bankId);
    }
  }

  addSelectedQuestions() {
    if (!this.selectedExamForQuestions) return;

    const selectedQuestions = this.questions.filter(q => q.isSelected).map(q => q.id!);

    if (selectedQuestions.length === 0) {
      alert('Please select at least one question.');
      return;
    }

    const dto: CreateUpdateExamQuestionDto = {
      examId: this.selectedExamForQuestions.id,
      questionIds: selectedQuestions,
      questionBankIds: this.selectedBankIds,
    };

    this.loadingQuestions = true;
    this.examService.addQuestionToExam(dto).subscribe({
      next: () => {
        this.loadingQuestions = false;
        alert('Questions added successfully!');
        this.switchTab('exams');
        this.loadExams();
      },
      error: (err) => {
        this.loadingQuestions = false;
        alert('Error adding questions: ' + err.message);
      }
    });
  }
}