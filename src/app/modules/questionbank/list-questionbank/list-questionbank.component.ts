import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { QuestionBankDto, QuestionBankService, CreateUpdateQuestionBankDto } from '@proxy/dev/acadmy/questions';
import { CourseService } from '@proxy/dev/acadmy/courses';
import { LookupDto } from '@proxy/dev/acadmy/look-up';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-list-questionbank',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule,RouterLink],
  templateUrl: './list-questionbank.component.html',
  styleUrl: './list-questionbank.component.scss'
})
export class ListQuestionbankComponent implements OnInit {
  // بيانات العرض
  questionBanks: any[] = [];
  courses: LookupDto[] = [];
  loading = false;
  search = '';

  // الباجيناشن
  totalCount = 0;
  pageSize = 10;
  pageIndex = 1;

  // المودال والنموذج
  questionBankForm: FormGroup;
  showFormModal = false;
  isEditMode = false;
  selectedId: string | null = null;

  // حذف
  showDeleteConfirm = false;
  itemToDelete: any = null;

  constructor(
    private fb: FormBuilder,
    private questionBankService: QuestionBankService,
    private courseService: CourseService
  ) {
    this.questionBankForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadQuestionBanks();
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getMyCoursesLookUp().subscribe(res => this.courses = res.items);
  }

  loadQuestionBanks(): void {
    this.loading = true;
    this.questionBankService
      .getList(this.pageIndex, this.pageSize, this.search)
      .subscribe({
        next: (res) => {
          this.questionBanks = res.items.map(q => ({ ...q, showMenu: false }));
          this.totalCount = res.totalCount;
          this.loading = false;
        },
        error: () => this.loading = false
      });
  }

  // منطق الباجيناشن والبحث
  get totalPages(): number { return Math.ceil(this.totalCount / this.pageSize); }
  onPageChange(page: number) { this.pageIndex = page; this.loadQuestionBanks(); }
  onSearchChange() { this.pageIndex = 1; this.loadQuestionBanks(); }

  // إجراءات المودال
  openCreateModal() {
    this.isEditMode = false;
    this.showFormModal = true;
  }

  openEditModal(qb: any) {
    this.isEditMode = true;
    this.selectedId = qb.id;
    this.questionBankForm.patchValue({
      name: qb.name,
    });
    this.showFormModal = true;
  }

  closeFormModal() {
    this.showFormModal = false;
    this.selectedId = null;
  }

  submitForm() {
    if (this.questionBankForm.invalid) return;
    this.loading = true;
    const dto: CreateUpdateQuestionBankDto = this.questionBankForm.value;

    const request = this.isEditMode 
      ? this.questionBankService.update(this.selectedId!, dto)
      : this.questionBankService.create(dto);

    request.subscribe({
      next: () => {
        this.loadQuestionBanks();
        this.closeFormModal();
      },
      error: (err) => {
        this.loading = false;
        alert(err.message);
      }
    });
  }

  // الحذف
  confirmDelete(qb: any) {
    this.itemToDelete = qb;
    this.showDeleteConfirm = true;
  }

  deleteItem() {
    if (!this.itemToDelete) return;
    this.loading = true;
    this.questionBankService.delete(this.itemToDelete.id).subscribe({
      next: () => {
        this.loadQuestionBanks();
        this.showDeleteConfirm = false;
        this.itemToDelete = null;
      },
      error: () => this.loading = false
    });
  }
}