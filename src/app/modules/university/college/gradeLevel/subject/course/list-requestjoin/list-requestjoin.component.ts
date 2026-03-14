import { PagedResultDto } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseStudentDto, CourseStudentService, CreateUpdateCourseStudentDto } from '@proxy/dev/acadmy/courses';

@Component({
  selector: 'app-list-requestjoin',
  standalone: true,
  imports: [ CommonModule, FormsModule],
  templateUrl: './list-requestjoin.component.html',
  styleUrl: './list-requestjoin.component.scss'
})
export class ListRequestjoinComponent implements OnInit {
  students: (CourseStudentDto & { processing?: boolean, showMenu?: boolean })[] = [];
  totalCount = 0;
  pageNumber = 1;
  pageSize = 12;
  courseId!: string;
  loading = false;
  search = '';

  // حذف الطلب (الرفض النهائي)
  showDeleteConfirm = false;
  requestToDelete: CourseStudentDto | null = null;

  constructor(
    private courseStudentService: CourseStudentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('courseId') ?? '';
    this.loadStudents();
  }

  loadStudents() {
    if (!this.courseId) return;
    this.loading = true;
    this.courseStudentService.getList(
      this.pageNumber,
      this.pageSize,
      false, // الطلبات المعلقة فقط
      this.courseId,
      this.search
    ).subscribe((res: PagedResultDto<CourseStudentDto>) => {
      this.students = res.items ?? [];
      this.totalCount = res.totalCount;
      this.loading = false;
    });
  }

  // ✅ الموافقة على الطالب
  approveStudent(student: any) {
    student.processing = true;
    const input: CreateUpdateCourseStudentDto = {
      userId: student.userId,
      courseId: this.courseId,
      isSubscibe: true
    };

    this.courseStudentService.update(student.id, input).subscribe({
      next: () => {
        this.loadStudents(); // إعادة التحميل لنقله لقائمة المشتركين
      },
      error: () => student.processing = false
    });
  }

  // ❌ رفض (حذف الطلب تماماً)
  confirmReject(student: CourseStudentDto) {
    this.requestToDelete = student;
    this.showDeleteConfirm = true;
  }

  executeDelete() {
    if (this.requestToDelete?.userId) {
      this.courseStudentService.delete(this.requestToDelete.userId).subscribe(() => {
        this.showDeleteConfirm = false;
        this.loadStudents();
      });
    }
  }

  onPageChange(page: number) {
    this.pageNumber = page;
    this.loadStudents();
  }

  get totalPages(): number { return Math.ceil(this.totalCount / this.pageSize); }
  get pages(): number[] { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }
}