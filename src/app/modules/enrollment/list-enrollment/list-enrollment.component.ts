import { PagedResultDto } from '@abp/ng.core';
import { NgClass, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CourseStudentDto, CreateUpdateCourseStudentDto, CourseStudentService } from '@proxy/dev/acadmy/courses';

@Component({
  selector: 'app-list-enrollment',
  standalone: true,
  imports: [FormsModule, NgClass, DatePipe],
  templateUrl: './list-enrollment.component.html',
  styleUrl: './list-enrollment.component.scss',
  providers: [DatePipe]
})
export class ListEnrollmentComponent implements OnInit {
  // بيانات الطلاب
  students: CourseStudentDto[] = [];
  loading = false;
  search = '';
  isSubscribe = true;

  // الباجيناشن
  pageNumber = 1;
  pageSize = 12; // يفضل 12 ليتناسب مع Grid (4-3-2 كروت في الصف)
  totalCount = 0;

  // تأكيدات الحذف
  showDeleteConfirm = false;
  studentToDelete?: CourseStudentDto;
  showDeleteAllConfirm = false;

  constructor(private courseStudentService: CourseStudentService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  // تغيير الفلتر (مشتركين / يحتاجون اشتراك)
  setSubscriptionFilter(value: boolean): void {
    this.isSubscribe = value;
    this.pageNumber = 1;
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.courseStudentService
      .getListStudents(this.pageNumber, this.pageSize, this.isSubscribe, this.search)
      .subscribe({
        next: (res: PagedResultDto<CourseStudentDto>) => {
          this.students = res.items.map(s => ({ ...s, showMenu: false })) ?? [];
          this.totalCount = res.totalCount ?? 0;
          this.loading = false;
        },
        error: (err) => {
          console.error('API Error:', err);
          this.loading = false;
        }
      });
  }

  // تغيير حالة اشتراك طالب واحد
  toggleSubscription(student: CourseStudentDto): void {
    const updateDto: CreateUpdateCourseStudentDto = {
      userId: student.userId!,
      courseId: student.courseId!,
      isSubscibe: !student.isSubscibe
    };

    this.courseStudentService.update(student.id!, updateDto).subscribe({
      next: () => {
        // بدلاً من إعادة التحميل، نحدث العنصر في القائمة أو نزيله حسب الفلتر الحالي
        this.loadStudents(); 
      },
      error: (err) => console.error('Failed to update subscription:', err)
    });
  }

  // باجيناشن
  get totalPages(): number { return Math.ceil(this.totalCount / this.pageSize); }
  
  onPageChange(page: number) {
    this.pageNumber = page;
    this.loadStudents();
  }

  onSearchChange() {
    this.pageNumber = 1;
    this.loadStudents();
  }

  // منطق الحذف
  confirmDelete(student: CourseStudentDto) {
    this.studentToDelete = student;
    this.showDeleteConfirm = true;
  }

  deleteStudent() {
    if (!this.studentToDelete) return;
    this.courseStudentService.delete(this.studentToDelete.id!).subscribe(() => {
      this.showDeleteConfirm = false;
      this.loadStudents();
    });
  }

  deleteAllStudents() {
    this.courseStudentService.deleteAllStudentInAllCourses().subscribe(() => {
      this.showDeleteAllConfirm = false;
      this.loadStudents();
    });
  }
}