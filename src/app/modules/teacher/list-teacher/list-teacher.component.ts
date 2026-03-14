import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TeacherDto, TeacherService, CreateUpdateTeacherDto } from '@proxy/dev/acadmy/teachers';
import { UniversityService, CollegeService } from '@proxy/dev/acadmy/universites';
import { AccountcustomService } from '@proxy/dev/acadmy/account-customs';
import { LookupDto } from '@proxy/dev/acadmy/look-up';

@Component({
  selector: 'app-list-teacher',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './list-teacher.component.html',
  styleUrl: './list-teacher.component.scss'
})
export class ListTeacherComponent implements OnInit {
  // Data Properties
  teachers: any[] = [];
  loading = false;
  search = '';
  
  // Pagination
  totalCount = 0;
  pageSize = 10;
  pageIndex = 1;

  // Lookups
  universities: LookupDto[] = [];
  colleges: LookupDto[] = [];

  // Form & Modals
  teacherForm: FormGroup;
  showFormModal = false;
  isEditMode = false;
  selectedTeacherId: string | null = null;

  // Password Reset Modal
  showPasswordModal = false;
  selectedTeacher: any = null;
  newPassword = '';
  confirmPassword = '';
  passwordError = '';

  constructor(
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private universityService: UniversityService,
    private collegeService: CollegeService,
    private accountService: AccountcustomService
  ) {
    this.teacherForm = this.fb.group({
      fullName: ['', Validators.required],
      userName: ['', Validators.required],
      password: [''],
      gender: ['', Validators.required],
      universityId: ['', Validators.required],
      collegeId: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      accountTypeKey: [2], // 2 = Teacher
      teacherMobileIP: ['']
    });
  }

  ngOnInit(): void {
    this.loadTeachers();
    this.loadInitialData();
    this.setupFormListeners();
  }

  loadInitialData() {
    this.universityService.getUniversitysList().subscribe(res => this.universities = res.items);
  }

  setupFormListeners() {
    this.teacherForm.get('universityId')?.valueChanges.subscribe(id => {
      this.colleges = [];
      this.teacherForm.patchValue({ collegeId: '' }, { emitEvent: false });
      if (id) this.collegeService.getCollegesList(id).subscribe(res => this.colleges = res.items);
    });
  }

  loadTeachers() {
    this.loading = true;
    this.teacherService.getTeacherList(this.pageIndex, this.pageSize, this.search).subscribe({
      next: (res) => {
        this.teachers = res.items.map(t => ({ ...t, showMenu: false }));
        this.totalCount = res.totalCount;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  // Pagination Logic
  get totalPages(): number { return Math.ceil(this.totalCount / this.pageSize); }
  onPageChange(page: number) { this.pageIndex = page; this.loadTeachers(); }
  onSearchChange() { this.pageIndex = 1; this.loadTeachers(); }

  // Modal Actions
  openCreateModal() {
    this.isEditMode = false;
    this.teacherForm.reset({ universityId: '', collegeId: '', gender: '', accountTypeKey: 2 });
    this.teacherForm.get('password')?.setValidators([Validators.required]);
    this.showFormModal = true;
  }

 openEditModal(teacher: any) {
  this.isEditMode = true;
  this.selectedTeacherId = teacher.id;
  this.teacherForm.get('password')?.clearValidators();
  
  // تحميل الكليات فقط
  this.collegeService.getCollegesList(teacher.universityId).subscribe(cRes => {
    this.colleges = cRes.items;

    // أهم خطوة: استخدم emitEvent: false لمنع الـ Listener من مسح الداتا
    this.teacherForm.patchValue(teacher, { emitEvent: false });
    
    this.showFormModal = true;
  });
}
  closeFormModal() { this.showFormModal = false; }

  submitForm() {
    if (this.teacherForm.invalid) return;
    this.loading = true;
    const dto = this.teacherForm.value;
    if(this.isEditMode) dto.password="12345"
    const request = this.isEditMode 
      ? this.teacherService.update(this.selectedTeacherId!, dto)
      : this.teacherService.create(dto);

    request.subscribe({
      next: () => { this.loadTeachers(); this.closeFormModal(); },
      error: (err) => { this.loading = false; alert(err.message); }
    });
  }

  // Password Reset
  openPasswordModal(teacher: any) {
    this.selectedTeacher = teacher;
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordError = '';
    this.showPasswordModal = true;
  }

  resetPassword() {
    if (!this.newPassword || this.newPassword !== this.confirmPassword) {
      this.passwordError = "Passwords do not match";
      return;
    }
    this.loading = true;
    this.accountService.resetPassword(this.selectedTeacher.id, this.newPassword).subscribe({
      next: () => { alert('Success!'); this.showPasswordModal = false; this.loading = false; },
      error: (err) => { this.loading = false; alert(err.message); }
    });
  }

  confirmDelete(teacher: any) {
    if (confirm(`Are you sure you want to delete ${teacher.fullName}?`)) {
      this.teacherService.delete(teacher.id).subscribe(() => this.loadTeachers());
    }
  }
}