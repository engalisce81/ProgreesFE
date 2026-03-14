import { PagedResultDto } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CourseStudentDto, CourseStudentService } from '@proxy/dev/acadmy/courses';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-subscriber',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './list-subscriber.component.html',
  styleUrl: './list-subscriber.component.scss'
})
export class ListSubscriberComponent implements OnInit {
  students: (CourseStudentDto & { showMenu?: boolean })[] = [];
  totalCount = 0;
  pageNumber = 1;
  pageSize = 12;
  courseId!: string;
  loading = false;
  search = '';

  // منطق الحذف
  showDeleteConfirm = false;
  studentToDelete: CourseStudentDto | null = null;

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
      true, 
      this.courseId,
      this.search
    ).subscribe((res: PagedResultDto<CourseStudentDto>) => {
      this.students = res.items ?? [];
      this.totalCount = res.totalCount;
      this.loading = false;
    });
  }

  // تنفيذ الحذف
  confirmDelete(student: CourseStudentDto) {
    this.studentToDelete = student;
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.studentToDelete = null;
  }

  deleteStudent() {
    if (this.studentToDelete?.id) {
      this.courseStudentService.delete(this.studentToDelete.id).subscribe(() => {
        this.showDeleteConfirm = false;
        this.studentToDelete = null;
        this.loadStudents(); // إعادة تحميل القائمة
      });
    }
  }

  onSearchChange() {
    this.pageNumber = 1;
    this.loadStudents();
  }

  onPageChange(page: number) {
    this.pageNumber = page;
    this.loadStudents();
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}