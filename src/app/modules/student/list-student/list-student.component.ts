import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StudentDto, StudentService, CreateUpdateStudentDto } from '@proxy/dev/acadmy/students';
import { UniversityService, CollegeService } from '@proxy/dev/acadmy/universites';
import { AccountcustomService } from '@proxy/dev/acadmy/account-customs';
import { CourseStudentService } from '@proxy/dev/acadmy/courses';
import { CreateUpdateStudentCoursesDto } from '@proxy/dev/acadmy/courses/models';
import { CourseLookupDto } from '@proxy/dev/acadmy/entities/courses/entities/models';
import { LookupDto } from '@proxy/dev/acadmy/look-up';
import { NgClass } from '@angular/common';
import { ShowPasswordDirective } from "@abp/ng.core";

@Component({
  selector: 'app-list-student',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgClass],
  templateUrl: './list-student.component.html',
  styleUrl: './list-student.component.scss'
})
export class ListStudentComponent implements OnInit {
  // Data Properties
  students: any[] = [];
  loading = false;
  search = '';
  
  // Pagination
  totalCount = 0;
  pageSize = 10;
  pageIndex = 1;

  // Lookups
  universities: LookupDto[] = [];
  colleges: LookupDto[] = [];
  gradeLevels: LookupDto[] = [];

  // Form & Modals
  studentForm: FormGroup;
  showFormModal = false;
  isEditMode = false;
  selectedStudentId: string | null = null;

  // Password Reset Modal
  showPasswordModal = false;
  selectedStudent: any = null;
  newPassword = '';
  confirmPassword = '';
  passwordError = '';

  // Assign Courses Modal
  showAssignCoursesModal = false;
  courses: CourseLookupDto[] = [];
  courseSearch = '';
    showDeleteConfirm = false;
studentToDelete:StudentDto;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private universityService: UniversityService,
    private collegeService: CollegeService,
    private accountService: AccountcustomService,
    private courseStudentService: CourseStudentService
  ) {
    this.studentForm = this.fb.group({
      fullName: ['', Validators.required],
      userName: ['', Validators.required],
      password: [''],
      gender: ['', Validators.required],
      universityId: ['', Validators.required],
      collegeId: ['', Validators.required],
      gradeLevelId: ['', Validators.required],
      accountTypeKey: [3],
      studentMobileIP: [''],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]]
     
    });
  }

  ngOnInit(): void {
    this.loadStudents();
    this.loadInitialData();
    this.setupFormListeners();
  }

  loadInitialData() {
    this.universityService.getUniversitysList().subscribe(res => this.universities = res.items);
  }

  setupFormListeners() {
    this.studentForm.get('universityId')?.valueChanges.subscribe(id => {
      this.colleges = [];
      this.gradeLevels = [];
      this.studentForm.patchValue({ collegeId: '', gradeLevelId: '' }, { emitEvent: false });
      if (id) this.collegeService.getCollegesList(id).subscribe(res => this.colleges = res.items);
    });

    this.studentForm.get('collegeId')?.valueChanges.subscribe(id => {
      this.gradeLevels = [];
      this.studentForm.patchValue({ gradeLevelId: '' }, { emitEvent: false });
      if (id) this.collegeService.getGradeLevelList(id).subscribe(res => this.gradeLevels = res.items);
    });
  }

  loadStudents() {
    this.loading = true;
    this.studentService.getStudentList(this.pageIndex, this.pageSize, this.search).subscribe({
      next: (res) => {
        this.students = res.items.map(s => ({ ...s, showMenu: false }));
        this.totalCount = res.totalCount;
        console.log(this.students);
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  // Pagination Logic
  get totalPages(): number { return Math.ceil(this.totalCount / this.pageSize); }
  onPageChange(page: number) { this.pageIndex = page; this.loadStudents(); }
  onSearchChange() { this.pageIndex = 1; this.loadStudents(); }

  // Modal Actions
  openCreateModal() {
    this.isEditMode = false;
    this.studentForm.reset({ universityId: '', collegeId: '', gradeLevelId: '', gender: '', accountTypeKey: 3 });
    this.studentForm.get('password')?.setValidators([Validators.required]);
    this.showFormModal = true;
  }

  openEditModal(student: any) {
  this.isEditMode = true;
  this.selectedStudentId = student.id;
  this.studentForm.get('password')?.clearValidators();
  
  // 1. تحميل الكليات أولاً
  this.collegeService.getCollegesList(student.universityId).subscribe(cRes => {
    this.colleges = cRes.items;
    
    // 2. تحميل المستويات الدراسية ثانياً
    this.collegeService.getGradeLevelList(student.collegeId).subscribe(gRes => {
      this.gradeLevels = gRes.items;

      // 3. تعطيل الـ Listeners مؤقتاً أو استخدام { emitEvent: false } 
      // لمنع الـ Listener في setupFormListeners من مسح الداتا
      this.studentForm.patchValue(student, { emitEvent: false });
      
      this.showFormModal = true;
    });
  });
}

  closeFormModal() { this.showFormModal = false; }

  submitForm() {
    if (this.studentForm.invalid) return;
    this.loading = true;
    const dto = this.studentForm.value;
    if(this.isEditMode) dto.password ="123456";
    const request = this.isEditMode 
      ? this.studentService.update(this.selectedStudentId!, dto)
      : this.studentService.create(dto);

    request.subscribe({
      next: () => { this.loadStudents(); this.closeFormModal(); },
      error: (err) => { this.loading = false; alert(err.message); }
    });
  }

  // Password Reset
  openPasswordModal(student: any) {
    this.selectedStudent = student;
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
    this.accountService.resetPassword(this.selectedStudent.id, this.newPassword).subscribe({
      next: () => { alert('Success!'); this.showPasswordModal = false; this.loading = false; },
      error: (err) => { this.loading = false; alert(err.message); }
    });
  }

  // Assign Courses
  openAssignCoursesModal(student: any) {
    this.selectedStudent = student;
    this.courseStudentService.getListCoursesToAssginToStudent('', 1, 100, student.id).subscribe(res => {
      this.courses = res.items;
      this.showAssignCoursesModal = true;
    });
  }

  assignCourses() {
    const input: CreateUpdateStudentCoursesDto = {
      userId: this.selectedStudent.id,
      courseIds: this.courses.filter(c => c.isSelect).map(c => c.courseId!)
    };
    this.courseStudentService.assignStudentToCoursesByInput(input).subscribe(() => {
      this.showAssignCoursesModal = false;
      alert('Courses assigned successfully');
    });
  }



  confirmDelete(student: any) { 
  this.studentToDelete = student; 
  this.showDeleteConfirm = true; 
}

// 2. إلغاء العملية وإغلاق المودال
cancelDelete() { 
  this.studentToDelete = null;
  this.showDeleteConfirm = false; 
}

// 3. تنفيذ عملية الحذف الفعلية
deleteStudent() {
  if (this.studentToDelete) {
    this.studentService.delete(this.studentToDelete.id).subscribe({
      next: () => {
        // إغلاق المودال وتحديث القائمة بعد النجاح
        this.showDeleteConfirm = false;
        this.loadStudents(); 
        // يمكنك إضافة رسالة نجاح هنا (Toaster)
      },
      error: (err) => {
        console.error("خطأ أثناء الحذف:", err);
        this.showDeleteConfirm = false;
      }
    });
  }
}
}