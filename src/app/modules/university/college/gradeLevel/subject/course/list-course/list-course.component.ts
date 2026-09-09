import { ConfigStateService } from '@abp/ng.core';
import { NgFor, NgIf } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CourseDto, CourseService } from '@proxy/dev/acadmy/courses';
import { CourseType } from '@proxy/dev/acadmy/enums';
import { MediaItemService } from '@proxy/dev/acadmy/media-items';
import { Subject, debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';

const CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB لكل chunk

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
  selectedType: CourseType = CourseType.All;
  courseTypes = CourseType;
  subjectId: string = '';
  collegeId: string = '';
  private searchSubject = new Subject<string>();
  totalCount = 0;
  pageSize = 12;
  pageIndex = 1;
  roles: string[] = [];

  // ── حالة المودال ────────────────────────────────────────
  showVideoModal = false;
  selectedCourseForVideo: CourseDto | null = null;
  selectedVideoFile: File | null = null;
  isUploadingVideo = false;
  uploadComplete = false;
  uploadedVideoUrl: string | null = null;
  uploadError: string | null = null;

  // ── progress ─────────────────────────────────────────────
  uploadProgress = 0;          // 0 → 100
  uploadStatusText = '';       // نص وصفي تحت الـ progress bar
  private currentUploadId: string | null = null;  // للإلغاء عند الحاجة

  // ── حذف ──────────────────────────────────────────────────
  showDeleteConfirm = false;
  courseToDelete!: CourseDto;

  private route         = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  private config        = inject(ConfigStateService);
  private mediaService  = inject(MediaItemService);

  // ════════════════════════════════════════════════════════
  //  Lifecycle
  // ════════════════════════════════════════════════════════
  ngOnInit(): void {
    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(val => {
        this.search = val;
        this.pageIndex = 1;
        this.loadCourses();
      });
    this.loadCourses();
    this.roles = this.config.getOne('currentUser')?.roles ?? [];
  }

  // ════════════════════════════════════════════════════════
  //  Courses CRUD
  // ════════════════════════════════════════════════════════
  onSearchKeyup(event: any): void { this.searchSubject.next(event.target.value); }

  onTabChange(type: CourseType): void {
    this.selectedType = type;
    this.pageIndex = 1;
    this.loadCourses();
  }

  loadCourses(): void {
    this.subjectId = this.route.snapshot.params['subjectId'];
    this.collegeId = this.route.snapshot.params['collegeId'];
    this.loading = true;
    this.courseService
      .getListBySubjectAndCourse(
        this.pageIndex, this.pageSize, this.search,
        this.selectedType, this.subjectId, this.collegeId
      )
      .subscribe({
        next: (res) => {
          this.courses = res.items.map(c => ({ ...c, showMenu: false }));
          this.totalCount = res.totalCount;
          this.loading = false;
        },
        error: () => (this.loading = false)
      });
  }

  get totalPages(): number { return Math.ceil(this.totalCount / this.pageSize); }
  get pages(): number[] {
    const pages = [];
    for (
      let i = Math.max(1, this.pageIndex - 2);
      i <= Math.min(this.totalPages, this.pageIndex + 2);
      i++
    ) pages.push(i);
    return pages;
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageIndex = page;
      this.loadCourses();
    }
  }

  get isAdmin(): boolean { return this.roles.includes('admin'); }

  confirmDelete(course: CourseDto): void { this.courseToDelete = course; this.showDeleteConfirm = true; }
  cancelDelete(): void { this.showDeleteConfirm = false; }

  deleteCourse(): void {
    this.courseService.delete(this.courseToDelete.id).subscribe(() => {
      this.showDeleteConfirm = false;
      this.loadCourses();
    });
  }

  deleteVideo(course: CourseDto): void {
    this.mediaService.deleteVideo(course.id).subscribe(() => this.loadCourses());
  }

  duplicate(id: string): void {
    this.courseService.duplicateCourse(id).subscribe(() => this.loadCourses());
  }

  @HostListener('document:click')
  onDocumentClick() { this.courses.forEach(c => (c.showMenu = false)); }

  // ════════════════════════════════════════════════════════
  //  Video Modal
  // ════════════════════════════════════════════════════════
  openVideoModal(course: CourseDto): void {
    this.selectedCourseForVideo = course;
    this.showVideoModal = true;
    this.resetUploadState();
  }

  closeVideoModal(): void {
    // لو في رفع جارٍ → نلغيه أولاً
    if (this.isUploadingVideo && this.currentUploadId) {
      this.mediaService
        .cancelUploadByUploadId(this.currentUploadId)
        .subscribe({ error: () => {} }); // تجاهل الخطأ
    }
    this.showVideoModal = false;
    this.selectedCourseForVideo = null;
    this.resetUploadState();
  }

  onVideoFileSelected(event: any): void {
    const file: File | undefined = event.target.files?.[0];
    if (file) {
      this.selectedVideoFile = file;
      this.uploadError = null;
    }
  }

  // ════════════════════════════════════════════════════════
  //  Chunked Upload  ★ المنطق الرئيسي ★
  // ════════════════════════════════════════════════════════
  async uploadVideoToServer(): Promise<void> {
    if (!this.selectedVideoFile || !this.selectedCourseForVideo) return;

    const file        = this.selectedVideoFile;
    const refId       = this.selectedCourseForVideo.id;
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const uploadId    = crypto.randomUUID();

    this.currentUploadId  = uploadId;
    this.isUploadingVideo = true;
    this.uploadError      = null;
    this.uploadComplete   = false;
    this.uploadProgress   = 0;
    this.uploadStatusText = `جارٍ التحضير… (0 / ${totalChunks} chunks)`;

    try {
      for (let index = 0; index < totalChunks; index++) {
        // تقطيع الملف
        const start    = index * CHUNK_SIZE;
        const end      = Math.min(start + CHUNK_SIZE, file.size);
        const chunkBlob = file.slice(start, end);

        // تحويل Blob → File حتى يتعرف عليه الـ FormData صح
        const chunkFile = new File([chunkBlob], file.name, { type: file.type });

        // إرسال الـ chunk
        const response = await firstValueFrom(
          this.mediaService.uploadChunk({
            uploadId,
            chunkIndex:       index,
            totalChunks,
            chunkData:        chunkFile,
            originalFileName: file.name,
            refId:            refId,
            type:             2,          // Course = 2
          })
        );

        if (!response.success) {
          throw new Error(response.message || 'فشل chunk غير متوقع');
        }

        // ── تحديث شريط التقدم ──────────────────────────
        this.uploadProgress   = Math.round(((index + 1) / totalChunks) * 100);
        this.uploadStatusText = `chunk ${index + 1} / ${totalChunks} — ${this.uploadProgress}%`;

        // ── آخر chunk → انتهت عملية الرفع ───────────────
        if (index === totalChunks - 1) {
          this.uploadProgress   = 100;
          this.uploadStatusText = 'اكتمل الرفع! جارٍ المعالجة في الخلفية…';
          this.uploadComplete   = true;
          this.isUploadingVideo = false;
          this.uploadedVideoUrl = response.data ?? null;

          // تحديث قائمة الكورسات
          this.loadCourses();
          if (response.data) {
            const idx = this.courses.findIndex(c => c.id === this.selectedCourseForVideo!.id);
            if (idx !== -1) {
              this.courses[idx] = { ...this.courses[idx], videoUrl: response.data };
            }
          }
        }
      }
    } catch (err: any) {
      // محاولة إلغاء الجلسة على السيرفر
      if (this.currentUploadId) {
        this.mediaService
          .cancelUploadByUploadId(this.currentUploadId)
          .subscribe({ error: () => {} });
      }

      this.isUploadingVideo = false;
      this.uploadProgress   = 0;
      this.uploadStatusText = '';
      this.uploadError      = err?.message ?? 'حدث خطأ أثناء الرفع';
    } finally {
      this.currentUploadId = null;
    }
  }

  // ════════════════════════════════════════════════════════
  //  Helpers
  // ════════════════════════════════════════════════════════
  private resetUploadState(): void {
    this.selectedVideoFile = null;
    this.isUploadingVideo  = false;
    this.uploadComplete    = false;
    this.uploadedVideoUrl  = null;
    this.uploadError       = null;
    this.uploadProgress    = 0;
    this.uploadStatusText  = '';
    this.currentUploadId   = null;
  }
}