import { PermissionService } from '@abp/ng.core';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LookupDto } from '@proxy/dev/acadmy/look-up';
import { SubjectDto, SubjectService, CollegeService, CreateUpdateSubjectDto } from '@proxy/dev/acadmy/universites';

@Component({
  selector: 'app-list-subject',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './list-subject.component.html',
  styleUrl: './list-subject.component.scss'
})
export class ListSubjectComponent implements OnInit {
  subjects: any[] = [];
  loading = false;
  search = '';
private permissionService = inject(PermissionService);
    hasCreatePermission = this.permissionService.getGrantedPolicy('Acadmy.Subjects.Create');
    hasEditPermission = this.permissionService.getGrantedPolicy('Acadmy.Subjects.Edit');
    hasDeletePermission = this.permissionService.getGrantedPolicy('Acadmy.Subjects.Delete');
    
  // Route Params
  universityId!: string;
  collegeId!: string;
  gradeLevelId!: string;

  // Lookups
  terms: LookupDto[] = [];

  // Modal & Form States
  showFormModal = false;
  showDeleteConfirm = false;
  isEditMode = false;
  subjectForm: FormGroup;
  selectedSubjectId: string | null = null;
  subjectToDelete: SubjectDto | null = null;

  constructor(
    private fb: FormBuilder,
    private subjectService: SubjectService,
    private collegeService: CollegeService,
    private route: ActivatedRoute
  ) {
    this.subjectForm = this.fb.group({
      name: ['', Validators.required],
      termId: ['', Validators.required],
      universityId: [''],
      collegeId: [''],
      gradeLevelId: ['']
    });
  }

  ngOnInit(): void {
    // جلب المعرفات من الرابط
    this.universityId = this.route.snapshot.paramMap.get('id') ?? '';
    this.collegeId = this.route.snapshot.paramMap.get('collegeId') ?? '';
    this.gradeLevelId = this.route.snapshot.paramMap.get('gradeLevelId') ?? '';

    this.loadSubjects();
    this.loadTerms();
  }

  loadTerms() {
    this.collegeService.getTermList().subscribe(res => this.terms = res.items);
  }

  loadSubjects(): void {
    this.loading = true;
    // فلترة المواد بناءً على المستوى الدراسي الممرر في الرابط
    this.subjectService.getList(1, 100, this.search, this.gradeLevelId).subscribe({
      next: (res) => {
        this.subjects = res.items.map(s => ({ ...s, showMenu: false }));
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onSearchChange(): void {
    this.loadSubjects();
  }

  openCreateModal() {
    this.isEditMode = false;
    this.subjectForm.reset({
      universityId: this.universityId,
      collegeId: this.collegeId,
      gradeLevelId: this.gradeLevelId,
      termId: ''
    });
    this.showFormModal = true;
  }

  openEditModal(subject: SubjectDto) {
    this.isEditMode = true;
    this.selectedSubjectId = subject.id;
    this.subjectForm.patchValue({
      name: subject.name,
      termId: subject.termId,
      universityId: this.universityId,
      collegeId: this.collegeId,
      gradeLevelId: this.gradeLevelId
    });
    this.showFormModal = true;
  }

  closeFormModal() {
    this.showFormModal = false;
    this.selectedSubjectId = null;
  }

  submitForm() {
    if (this.subjectForm.invalid) return;
    this.loading = true;

    const dto: CreateUpdateSubjectDto = {
      ...this.subjectForm.value,
      universityId: this.universityId,
      collegeId: this.collegeId,
      gradeLevelId: this.gradeLevelId
    };

    const request = this.isEditMode 
      ? this.subjectService.update(this.selectedSubjectId!, dto)
      : this.subjectService.create(dto);

    request.subscribe({
      next: () => {
        this.loadSubjects();
        this.closeFormModal();
      },
      error: (err) => {
        this.loading = false;
        alert('Error: ' + err.message);
      }
    });
  }

  confirmDelete(subject: SubjectDto) {
    this.subjectToDelete = subject;
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.subjectToDelete = null;
  }

  deleteSubject() {
    if (!this.subjectToDelete) return;
    this.subjectService.delete(this.subjectToDelete.id).subscribe({
      next: () => {
        this.loadSubjects();
        this.showDeleteConfirm = false;
      }
    });
  }
}