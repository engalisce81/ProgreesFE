import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LectureDto, LectureService, CreateUpdateLectureDto } from '@proxy/dev/acadmy/lectures';
import { MediaItemService } from '@proxy/dev/acadmy/media-items';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

const CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB

interface ExtendedLectureDto extends LectureDto {
  showMenu?: boolean;
  showPdfs?: boolean;
}

@Component({
  selector: 'app-list-lecture',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './list-lecture.component.html',
  styleUrl: './list-lecture.component.scss'
})
export class ListLectureComponent implements OnInit {
  lectures: ExtendedLectureDto[] = [];
  lectureForm!: FormGroup;

  loading    = false;
  submitting = false;
  search     = '';
  chapterId  = '';

  // ── Form ─────────────────────────────────────────────
  showForm           = false;
  isEditMode         = false;
  selectedLectureId: string | null = null;

  // ── Delete ───────────────────────────────────────────
  showDeleteConfirm = false;
  lectureToDelete: ExtendedLectureDto | null = null;

  // ── Pagination ───────────────────────────────────────
  totalCount = 0;
  pageSize   = 10;
  pageIndex  = 1;

  // ── Video Modal ──────────────────────────────────────
  showVideoModal           = false;
  selectedLectureForVideo: ExtendedLectureDto | null = null;
  selectedVideoFile: File | null = null;
  isUploadingVideo = false;
  uploadComplete   = false;
  uploadedVideoUrl: string | null = null;
  uploadError: string | null      = null;

  // ── Progress ─────────────────────────────────────────
  uploadProgress   = 0;
  uploadStatusText = '';
  private currentUploadId: string | null = null;

  // ── PDFs ─────────────────────────────────────────────
  pdfFiles: File[]     = [];
  existingPdfs: string[] = [];

  constructor(
    private lectureService:   LectureService,
    private mediaItemService: MediaItemService,
    private fb:               FormBuilder,
    private route:            ActivatedRoute
  ) { this.initForm(); }

  ngOnInit(): void {
    this.chapterId = this.route.snapshot.paramMap.get('chapterId') || '';
    if (this.chapterId) this.loadLectures();
  }

  // ════════════════════════════════════════════════════
  //  Form Init
  // ════════════════════════════════════════════════════
  initForm() {
    this.lectureForm = this.fb.group({
      title:           ['', Validators.required],
      content:         ['', Validators.required],
      youTubeVideoUrl: [''],
      driveVideoUrl:   [''],
      telegramVideoUrl:[''],
      quizTime:        [0, [Validators.required, Validators.min(0)]],
      quizTryCount:    [0, [Validators.required, Validators.min(0)]],
      quizCount:       [0, [Validators.required, Validators.min(0)]],
      successQuizRate: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      isVisible:       [true],
      isFree:          [false],
      isRequiredQuiz:  [false]
    });
  }

  // ════════════════════════════════════════════════════
  //  Lectures CRUD
  // ════════════════════════════════════════════════════
  loadLectures(): void {
    this.loading = true;
    this.lectureService.getList(this.pageIndex, this.pageSize, this.search, this.chapterId).subscribe({
      next: (res) => {
        this.lectures   = res.items!.map(l => ({ ...l, showMenu: false, showPdfs: false }));
        this.totalCount = res.totalCount!;
        this.loading    = false;
      },
      error: () => (this.loading = false)
    });
  }

  confirmDelete(lecture: ExtendedLectureDto): void { this.lectureToDelete = lecture; this.showDeleteConfirm = true; }
  cancelDelete(): void { this.showDeleteConfirm = false; this.lectureToDelete = null; }

  deleteLecture(): void {
    if (!this.lectureToDelete) return;
    this.loading = true;
    this.lectureService.delete(this.lectureToDelete.id!).subscribe({
      next: () => { this.showDeleteConfirm = false; this.lectureToDelete = null; this.loadLectures(); },
      error: (err) => { this.loading = false; alert('خطأ: ' + err.message); }
    });
  }

  deleteVideo(lecture: LectureDto): void {
    this.mediaItemService.deleteVideo(lecture.id!).subscribe(() => this.loadLectures());
  }

  // ── Pagination ───────────────────────────────────────
  onSearchChange(): void { this.pageIndex = 1; this.loadLectures(); }
  onPageChange(page: number): void { this.pageIndex = page; this.loadLectures(); }
  get totalPages(): number { return Math.ceil(this.totalCount / this.pageSize); }
  get pages(): number[] {
    const p = [];
    for (let i = 1; i <= this.totalPages; i++) p.push(i);
    return p;
  }

  // ── Inline Form ──────────────────────────────────────
  openCreateForm(): void {
    this.isEditMode = false; this.showForm = true;
    this.lectureForm.reset({ isVisible: true, isFree: false, isRequiredQuiz: false, quizTime: 0, quizCount: 0, quizTryCount: 0, successQuizRate: 0 });
    this.pdfFiles = []; this.existingPdfs = [];
  }

  openEditForm(lecture: ExtendedLectureDto): void {
    this.isEditMode = true; this.selectedLectureId = lecture.id!; this.showForm = true;
    this.lectureForm.patchValue(lecture);
    this.existingPdfs = [...(lecture.pdfUrls || [])];
    this.pdfFiles = [];
  }

  closeForm(): void { this.showForm = false; this.selectedLectureId = null; }

  onPdfSelected(event: any): void {
    if (event.target.files) this.pdfFiles.push(...Array.from(event.target.files as FileList));
  }
  removeNewPdf(index: number): void { this.pdfFiles.splice(index, 1); }
  removeExistingPdf(index: number): void { this.existingPdfs.splice(index, 1); }

  submit(): void {
    if (this.lectureForm.invalid) return;
    this.submitting = true;
    if (this.pdfFiles.length > 0) {
      this.mediaItemService.uploadImages(this.pdfFiles).subscribe({
        next: (res) => this.saveLecture([...this.existingPdfs, ...res.items!]),
        error: () => { this.submitting = false; alert('فشل رفع الملفات'); }
      });
    } else {
      this.saveLecture(this.existingPdfs);
    }
  }

  private saveLecture(pdfUrls: string[]): void {
    const dto: CreateUpdateLectureDto = { ...this.lectureForm.value, chapterId: this.chapterId, pdfUrls };
    const req = this.isEditMode && this.selectedLectureId
      ? this.lectureService.update(this.selectedLectureId, dto)
      : this.lectureService.create(dto);
    req.subscribe({ next: () => { this.submitting = false; this.showForm = false; this.loadLectures(); }, error: () => (this.submitting = false) });
  }

  // ════════════════════════════════════════════════════
  //  Video Modal
  // ════════════════════════════════════════════════════
  openVideoForm(lecture: ExtendedLectureDto): void {
    this.selectedLectureForVideo = lecture;
    this.showVideoModal = true;
    this.resetUploadState();
  }

  closeVideoModal(): void {
    if (this.isUploadingVideo && this.currentUploadId) {
      this.mediaItemService.cancelUploadByUploadId(this.currentUploadId).subscribe({ error: () => {} });
    }
    this.showVideoModal          = false;
    this.selectedLectureForVideo = null;
    this.resetUploadState();
  }

  onVideoFileSelected(event: any): void {
    const file: File | undefined = event.target.files?.[0];
    if (file) { this.selectedVideoFile = file; this.uploadError = null; }
  }

  // ════════════════════════════════════════════════════
  //  Chunked Upload  ★
  // ════════════════════════════════════════════════════
  async uploadVideoToServer(): Promise<void> {
    if (!this.selectedVideoFile || !this.selectedLectureForVideo) return;

    const file        = this.selectedVideoFile;
    const refId       = this.selectedLectureForVideo.id;
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
        const start     = index * CHUNK_SIZE;
        const end       = Math.min(start + CHUNK_SIZE, file.size);
        const chunkFile = new File([file.slice(start, end)], file.name, { type: file.type });

        const response = await firstValueFrom(
          this.mediaItemService.uploadChunk({
            uploadId,
            chunkIndex:       index,
            totalChunks,
            chunkData:        chunkFile,
            originalFileName: file.name,
            refId,
            type:             1,   // Lecture = 1
          })
        );

        if (!response.success) throw new Error(response.message || 'فشل chunk غير متوقع');

        // ── تحديث Progress ─────────────────────────────
        this.uploadProgress   = Math.round(((index + 1) / totalChunks) * 100);
        this.uploadStatusText = `chunk ${index + 1} / ${totalChunks} — ${this.uploadProgress}%`;

        // ── آخر chunk ─────────────────────────────────
        if (index === totalChunks - 1) {
          this.uploadProgress   = 100;
          this.uploadStatusText = 'اكتمل الرفع! جارٍ المعالجة في الخلفية…';
          this.uploadComplete   = true;
          this.isUploadingVideo = false;
          this.uploadedVideoUrl = response.data ?? null;

          this.loadLectures();
          if (response.data) {
            const idx = this.lectures.findIndex(l => l.id === this.selectedLectureForVideo!.id);
            if (idx !== -1) this.lectures[idx] = { ...this.lectures[idx], videoUrl: response.data };
          }
        }
      }
    } catch (err: any) {
      if (this.currentUploadId) {
        this.mediaItemService.cancelUploadByUploadId(this.currentUploadId).subscribe({ error: () => {} });
      }
      this.isUploadingVideo = false;
      this.uploadProgress   = 0;
      this.uploadStatusText = '';
      this.uploadError      = err?.message ?? 'حدث خطأ أثناء الرفع';
    } finally {
      this.currentUploadId = null;
    }
  }

  // ════════════════════════════════════════════════════
  //  Helper
  // ════════════════════════════════════════════════════
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




// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { ActivatedRoute, RouterLink } from '@angular/router';
// import { LectureDto, LectureService, CreateUpdateLectureDto } from '@proxy/dev/acadmy/lectures';
// import { MediaItemService } from '@proxy/dev/acadmy/media-items';
// import { CommonModule } from '@angular/common';
// import { firstValueFrom } from 'rxjs';

// const CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB

// interface ExtendedLectureDto extends LectureDto {
//   showMenu?: boolean;
//   showPdfs?: boolean;
// }

// @Component({
//   selector: 'app-list-lecture',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
//   templateUrl: './list-lecture.component.html',
//   styleUrl: './list-lecture.component.scss'
// })
// export class ListLectureComponent implements OnInit {
//   lectures: ExtendedLectureDto[] = [];
//   lectureForm!: FormGroup;

//   loading    = false;
//   submitting = false;
//   search     = '';
//   chapterId  = '';

//   // ── Form ─────────────────────────────────────────────
//   showForm           = false;
//   isEditMode         = false;
//   selectedLectureId: string | null = null;

//   // ── Delete ───────────────────────────────────────────
//   showDeleteConfirm = false;
//   lectureToDelete: ExtendedLectureDto | null = null;

//   // ── Pagination ───────────────────────────────────────
//   totalCount = 0;
//   pageSize   = 10;
//   pageIndex  = 1;

//   // ── Video Modal ──────────────────────────────────────
//   showVideoModal           = false;
//   selectedLectureForVideo: ExtendedLectureDto | null = null;
//   selectedVideoFile: File | null = null;
//   isUploadingVideo = false;
//   uploadComplete   = false;
//   uploadedVideoUrl: string | null = null;
//   uploadError: string | null      = null;

//   // ── Progress ─────────────────────────────────────────
//   uploadProgress   = 0;
//   uploadStatusText = '';
//   private currentUploadId: string | null = null;

//   // ── PDFs ─────────────────────────────────────────────
//   pdfFiles: File[]     = [];
//   existingPdfs: string[] = [];

//   constructor(
//     private lectureService:   LectureService,
//     private mediaItemService: MediaItemService,
//     private fb:               FormBuilder,
//     private route:            ActivatedRoute
//   ) { this.initForm(); }

//   ngOnInit(): void {
//     this.chapterId = this.route.snapshot.paramMap.get('chapterId') || '';
//     if (this.chapterId) this.loadLectures();
//   }

//   // ════════════════════════════════════════════════════
//   //  Form Init
//   // ════════════════════════════════════════════════════
//   initForm() {
//     this.lectureForm = this.fb.group({
//       title:           ['', Validators.required],
//       content:         ['', Validators.required],
//       youTubeVideoUrl: [''],
//       driveVideoUrl:   [''],
//       telegramVideoUrl:[''],
//       quizTime:        [0, [Validators.required, Validators.min(0)]],
//       quizTryCount:    [0, [Validators.required, Validators.min(0)]],
//       quizCount:       [0, [Validators.required, Validators.min(0)]],
//       successQuizRate: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
//       isVisible:       [true],
//       isFree:          [false],
//       isRequiredQuiz:  [false]
//     });
//   }

//   // ════════════════════════════════════════════════════
//   //  Lectures CRUD
//   // ════════════════════════════════════════════════════
//   loadLectures(): void {
//     this.loading = true;
//     this.lectureService.getList(this.pageIndex, this.pageSize, this.search, this.chapterId).subscribe({
//       next: (res) => {
//         this.lectures   = res.items!.map(l => ({ ...l, showMenu: false, showPdfs: false }));
//         this.totalCount = res.totalCount!;
//         this.loading    = false;
//       },
//       error: () => (this.loading = false)
//     });
//   }

//   confirmDelete(lecture: ExtendedLectureDto): void { this.lectureToDelete = lecture; this.showDeleteConfirm = true; }
//   cancelDelete(): void { this.showDeleteConfirm = false; this.lectureToDelete = null; }

//   deleteLecture(): void {
//     if (!this.lectureToDelete) return;
//     this.loading = true;
//     this.lectureService.delete(this.lectureToDelete.id!).subscribe({
//       next: () => { this.showDeleteConfirm = false; this.lectureToDelete = null; this.loadLectures(); },
//       error: (err) => { this.loading = false; alert('خطأ: ' + err.message); }
//     });
//   }

//   deleteVideo(lecture: LectureDto): void {
//     this.mediaItemService.deleteVideo(lecture.id!).subscribe(() => this.loadLectures());
//   }

//   // ── Pagination ───────────────────────────────────────
//   onSearchChange(): void { this.pageIndex = 1; this.loadLectures(); }
//   onPageChange(page: number): void { this.pageIndex = page; this.loadLectures(); }
//   get totalPages(): number { return Math.ceil(this.totalCount / this.pageSize); }
//   get pages(): number[] {
//     const p = [];
//     for (let i = 1; i <= this.totalPages; i++) p.push(i);
//     return p;
//   }

//   // ── Inline Form ──────────────────────────────────────
//   openCreateForm(): void {
//     this.isEditMode = false; this.showForm = true;
//     this.lectureForm.reset({ isVisible: true, isFree: false, isRequiredQuiz: false, quizTime: 0, quizCount: 0, quizTryCount: 0, successQuizRate: 0 });
//     this.pdfFiles = []; this.existingPdfs = [];
//   }

//   openEditForm(lecture: ExtendedLectureDto): void {
//     this.isEditMode = true; this.selectedLectureId = lecture.id!; this.showForm = true;
//     this.lectureForm.patchValue(lecture);
//     this.existingPdfs = [...(lecture.pdfUrls || [])];
//     this.pdfFiles = [];
//   }

//   closeForm(): void { this.showForm = false; this.selectedLectureId = null; }

//   onPdfSelected(event: any): void {
//     if (event.target.files) this.pdfFiles.push(...Array.from(event.target.files as FileList));
//   }
//   removeNewPdf(index: number): void { this.pdfFiles.splice(index, 1); }
//   removeExistingPdf(index: number): void { this.existingPdfs.splice(index, 1); }

//   submit(): void {
//     if (this.lectureForm.invalid) return;
//     this.submitting = true;
//     if (this.pdfFiles.length > 0) {
//       this.mediaItemService.uploadImages(this.pdfFiles).subscribe({
//         next: (res) => this.saveLecture([...this.existingPdfs, ...res.items!]),
//         error: () => { this.submitting = false; alert('فشل رفع الملفات'); }
//       });
//     } else {
//       this.saveLecture(this.existingPdfs);
//     }
//   }

//   private saveLecture(pdfUrls: string[]): void {
//     const dto: CreateUpdateLectureDto = { ...this.lectureForm.value, chapterId: this.chapterId, pdfUrls };
//     const req = this.isEditMode && this.selectedLectureId
//       ? this.lectureService.update(this.selectedLectureId, dto)
//       : this.lectureService.create(dto);
//     req.subscribe({ next: () => { this.submitting = false; this.showForm = false; this.loadLectures(); }, error: () => (this.submitting = false) });
//   }

//   // ════════════════════════════════════════════════════
//   //  Video Modal
//   // ════════════════════════════════════════════════════
//   openVideoForm(lecture: ExtendedLectureDto): void {
//     this.selectedLectureForVideo = lecture;
//     this.showVideoModal = true;
//     this.resetUploadState();
//   }

//   closeVideoModal(): void {
//     if (this.isUploadingVideo && this.currentUploadId) {
//       this.mediaItemService.cancelUploadByUploadId(this.currentUploadId).subscribe({ error: () => {} });
//     }
//     this.showVideoModal          = false;
//     this.selectedLectureForVideo = null;
//     this.resetUploadState();
//   }

//   onVideoFileSelected(event: any): void {
//     const file: File | undefined = event.target.files?.[0];
//     if (file) { this.selectedVideoFile = file; this.uploadError = null; }
//   }

//   // ════════════════════════════════════════════════════
//   //  Chunked Upload  ★
//   // ════════════════════════════════════════════════════
//   async uploadVideoToServer(): Promise<void> {
//     if (!this.selectedVideoFile || !this.selectedLectureForVideo) return;

//     const file        = this.selectedVideoFile;
//     const refId       = this.selectedLectureForVideo.id;
//     const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
//     const uploadId    = crypto.randomUUID();

//     this.currentUploadId  = uploadId;
//     this.isUploadingVideo = true;
//     this.uploadError      = null;
//     this.uploadComplete   = false;
//     this.uploadProgress   = 0;
//     this.uploadStatusText = `جارٍ التحضير… (0 / ${totalChunks} chunks)`;

//     try {
//       for (let index = 0; index < totalChunks; index++) {
//         const start     = index * CHUNK_SIZE;
//         const end       = Math.min(start + CHUNK_SIZE, file.size);
//         const chunkFile = new File([file.slice(start, end)], file.name, { type: file.type });

//         const response = await firstValueFrom(
//           this.mediaItemService.uploadChunk({
//             uploadId,
//             chunkIndex:       index,
//             totalChunks,
//             chunkData:        chunkFile,
//             originalFileName: file.name,
//             refId,
//             type:             1,   // Lecture = 1
//           })
//         );

//         if (!response.success) throw new Error(response.message || 'فشل chunk غير متوقع');

//         // ── تحديث Progress ─────────────────────────────
//         this.uploadProgress   = Math.round(((index + 1) / totalChunks) * 100);
//         this.uploadStatusText = `chunk ${index + 1} / ${totalChunks} — ${this.uploadProgress}%`;

//         // ── آخر chunk ─────────────────────────────────
//         if (index === totalChunks - 1) {
//           this.uploadProgress   = 100;
//           this.uploadStatusText = 'اكتمل الرفع! جارٍ المعالجة في الخلفية…';
//           this.uploadComplete   = true;
//           this.isUploadingVideo = false;
//           this.uploadedVideoUrl = response.data ?? null;

//           this.loadLectures();
//           if (response.data) {
//             const idx = this.lectures.findIndex(l => l.id === this.selectedLectureForVideo!.id);
//             if (idx !== -1) this.lectures[idx] = { ...this.lectures[idx], videoUrl: response.data };
//           }
//         }
//       }
//     } catch (err: any) {
//       if (this.currentUploadId) {
//         this.mediaItemService.cancelUploadByUploadId(this.currentUploadId).subscribe({ error: () => {} });
//       }
//       this.isUploadingVideo = false;
//       this.uploadProgress   = 0;
//       this.uploadStatusText = '';
//       this.uploadError      = err?.message ?? 'حدث خطأ أثناء الرفع';
//     } finally {
//       this.currentUploadId = null;
//     }
//   }

//   // ════════════════════════════════════════════════════
//   //  Helper
//   // ════════════════════════════════════════════════════
//   private resetUploadState(): void {
//     this.selectedVideoFile = null;
//     this.isUploadingVideo  = false;
//     this.uploadComplete    = false;
//     this.uploadedVideoUrl  = null;
//     this.uploadError       = null;
//     this.uploadProgress    = 0;
//     this.uploadStatusText  = '';
//     this.currentUploadId   = null;
//   }
// }
