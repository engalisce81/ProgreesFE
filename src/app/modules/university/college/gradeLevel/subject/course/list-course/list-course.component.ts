import { ConfigStateService } from '@abp/ng.core';
import { NgFor, NgIf } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CourseDto, CourseService } from '@proxy/dev/acadmy/courses'; // تأكد من المسار
import { CourseType } from '@proxy/dev/acadmy/enums';
import { MediaItemService } from '@proxy/dev/acadmy/media-items';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-list-course',
  standalone: true,
  imports: [RouterLink, FormsModule, NgIf],
  templateUrl: './list-course.component.html',
  styleUrl: './list-course.component.scss'
})
export class ListCourseComponent implements OnInit {
  courses: (CourseDto & { showMenu?: boolean })[] = [];
  loading = false;
  search = '';
  selectedType: CourseType = CourseType.All; // التاب الافتراضية
  courseTypes = CourseType; // لجعل الـ Enum متاح في الـ HTML
  subjectId: string = '';
  collegeId: string = '';
  private searchSubject = new Subject<string>();
  totalCount = 0;
  pageSize = 12;
  pageIndex = 1;
  roles: string[] = [];
  showVideoModal = false;
  selectedCourseForVideo: CourseDto | null = null;
  selectedVideoFile: File | null = null;
  isUploadingVideo = false;
  uploadComplete = false;
  uploadedVideoUrl: string | null = null;
  uploadError: string | null = null;

  showDeleteConfirm = false;
  courseToDelete!: CourseDto;
  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  private config = inject(ConfigStateService);
  private mediaService = inject(MediaItemService);


  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe(val => {
      this.search = val;
      this.pageIndex = 1;
      this.loadCourses();
    });
    this.loadCourses();
    this.roles = this.config.getOne("currentUser")?.roles ?? [];
  }

  onSearchKeyup(event: any): void {
    this.searchSubject.next(event.target.value);
  }

  onTabChange(type: CourseType): void {
    this.selectedType = type;
    this.pageIndex = 1;
    this.loadCourses();
  }

  loadCourses(): void {

    this.subjectId = this.route.snapshot.params['subjectId'];
    this.collegeId = this.route.snapshot.params['collegeId'];
    this.loading = true;
    this.courseService.getListBySubjectAndCourse(this.pageIndex, this.pageSize, this.search, this.selectedType, this.subjectId, this.collegeId).subscribe({
      next: (res) => {
        this.courses = res.items.map(c => ({ ...c, showMenu: false }));
        this.totalCount = res.totalCount;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  get totalPages(): number { return Math.ceil(this.totalCount / this.pageSize); }
  get pages(): number[] {
    const pages = [];
    for (let i = Math.max(1, this.pageIndex - 2); i <= Math.min(this.totalPages, this.pageIndex + 2); i++) pages.push(i);
    return pages;
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageIndex = page;
      this.loadCourses();
    }
  }

  hasRole(role: string): boolean { return this.roles.includes(role); }
  // داخل الكلاس
  get isAdmin(): boolean {
    return this.roles.includes('admin');
  }
  confirmDelete(course: CourseDto): void { this.courseToDelete = course; this.showDeleteConfirm = true; }
  cancelDelete(): void { this.showDeleteConfirm = false; }

  deleteCourse(): void {
    this.courseService.delete(this.courseToDelete.id).subscribe(() => {
      this.showDeleteConfirm = false;
      this.loadCourses();
    });
  }

    deleteVideo(course:CourseDto): void {

    this.mediaService.deleteVideo(course.id).subscribe(() => {
      this.loadCourses();
    });

  }


  duplicate(id: string): void {
    this.courseService.duplicateCourse(id).subscribe(() => this.loadCourses());
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // نقوم بإغلاق القائمة لجميع العناصر
    this.courses.forEach(ad => ad.showMenu = false);
  }

  // دوال مودال الفيديو
  openVideoModal(course: CourseDto) {
    this.selectedCourseForVideo = course;
    this.showVideoModal = true;
    this.selectedVideoFile = null;
    this.uploadComplete = false;
    this.uploadedVideoUrl = null;
    this.uploadError = null;
  }

  closeVideoModal() {
    this.showVideoModal = false;
    this.selectedCourseForVideo = null;
    this.selectedVideoFile = null;
    this.isUploadingVideo = false;
    this.uploadComplete = false;
    this.uploadedVideoUrl = null;
    this.uploadError = null;
  }

  onVideoFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedVideoFile = file;
      this.uploadError = null;
    }
  }

  uploadVideoToServer() {
    if (!this.selectedVideoFile || !this.selectedCourseForVideo) return;

    this.isUploadingVideo = true;
    this.uploadError = null;
    this.uploadComplete = false;

    const uploadDto: any = {
      videoFile: this.selectedVideoFile,
      type: 2, // استخدم نوع مناسب للكورسات (مثلاً 3)
      refId: this.selectedCourseForVideo.id
    };

    this.mediaService.uploadVideo(uploadDto).subscribe({
      next: (response) => {
        this.isUploadingVideo = false;
        this.uploadComplete = true;
        const videoUrl = response.data || response.message;
        this.uploadedVideoUrl = videoUrl || 'تم الرفع بنجاح';
        this.loadCourses();

        // تحديث الكورس في القائمة المحلية
        if (videoUrl) {
          const index = this.courses.findIndex(c => c.id === this.selectedCourseForVideo!.id);
          if (index !== -1) {
            this.courses[index] = { ...this.courses[index], videoUrl };
          }
        }
      },
      error: (err) => {
        this.isUploadingVideo = false;
        this.uploadError = err.message || 'حدث خطأ أثناء رفع الفيديو';
      }
    });
  }
}


