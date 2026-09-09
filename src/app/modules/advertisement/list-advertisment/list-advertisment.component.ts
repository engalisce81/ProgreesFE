import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MediaItemService } from '@proxy/dev/acadmy/media-items';
import { finalize, firstValueFrom } from 'rxjs';
import { CreateUpdateAdvertisementDto } from '@proxy/dev/acadmy/dtos/request/advertisementes';
import { AdvertisementDto } from '@proxy/dev/acadmy/dtos/response/advertisementes';
import { AdvertisementService } from '@proxy/dev/acadmy/services';

const CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB

@Component({
  selector: 'app-list-advertisement',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './list-advertisment.component.html',
  styleUrl: './list-advertisment.component.scss'
})
export class ListAdvertisementComponent implements OnInit {
  ads: (AdvertisementDto & { showMenu?: boolean })[] = [];
  loading   = false;
  uploading = false;

  // ── Pagination ───────────────────────────────────────
  pageIndex  = 1;
  pageSize   = 10;
  totalCount = 0;

  // ── Form Modal ───────────────────────────────────────
  showFormModal     = false;
  showDeleteConfirm = false;
  isEditMode        = false;
  selectedAdId: string | null = null;
  adToDelete!: AdvertisementDto;
  adForm: FormGroup;

  // ── Video Modal ──────────────────────────────────────
  showVideoModal       = false;
  selectedAdForVideo: AdvertisementDto | null = null;
  selectedVideoFile: File | null = null;
  isUploadingVideo  = false;
  uploadComplete    = false;
  uploadedVideoUrl: string | null = null;
  uploadError: string | null      = null;

  // ── Progress ─────────────────────────────────────────
  uploadProgress   = 0;
  uploadStatusText = '';
  private currentUploadId: string | null = null;

  constructor(
    private adService:    AdvertisementService,
    private mediaService: MediaItemService,
    private fb:           FormBuilder
  ) {
    this.adForm = this.fb.group({
      title:           ['', Validators.required],
      imageUrl:        [''],
      youTubeVideoUrl: [''],
      driveVideoUrl:   [''],
      startDate:       [null],
      endDate:         [null],
      isActive:        [true]
    });
  }

  ngOnInit(): void {
    this.loadAds();
    this.setupFormLogic();
  }

  // ════════════════════════════════════════════════════
  //  Ads CRUD
  // ════════════════════════════════════════════════════
  loadAds(): void {
    this.loading = true;
    this.adService.getActiveAdsList(this.pageIndex, this.pageSize)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(res => {
        this.ads        = res.items.map(ad => ({ ...ad, showMenu: false }));
        this.totalCount = res.totalCount;
      });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    this.uploading = true;
    this.mediaService.uploadImage(file).subscribe({
      next:  (res) => { this.adForm.patchValue({ imageUrl: res.data }); this.uploading = false; },
      error: ()    => { alert('Image upload failed'); this.uploading = false; }
    });
  }

  openCreateModal(): void {
    this.isEditMode = false; this.selectedAdId = null;
    this.adForm.reset({ isActive: true });
    this.showFormModal = true;
  }

  openEditModal(ad: AdvertisementDto): void {
    this.isEditMode = true; this.selectedAdId = ad.id;
    this.adForm.patchValue({
      title:           ad.title,
      imageUrl:        ad.imageUrl,
      targetUrl:       ad.youTubeVideoUrl,
      startDate:       ad.startDate ? ad.startDate.split('T')[0] : null,
      endDate:         ad.endDate   ? ad.endDate.split('T')[0]   : null,
      isActive:        ad.isActive
    });
    this.showFormModal = true;
  }

  deleteVideo(ad: AdvertisementDto): void {
    this.mediaService.deleteVideo(ad.id).subscribe(() => this.loadAds());
  }

  submitForm(): void {
    if (this.adForm.invalid) return;
    const dto: CreateUpdateAdvertisementDto = this.adForm.value;
    this.loading = true;
    const request = this.isEditMode && this.selectedAdId
      ? this.adService.update(this.selectedAdId, dto)
      : this.adService.create(dto);
    request.pipe(finalize(() => (this.loading = false))).subscribe(() => {
      this.showFormModal = false; this.loadAds();
    });
  }

  confirmDelete(ad: AdvertisementDto): void { this.adToDelete = ad; this.showDeleteConfirm = true; }

  deleteAd(): void {
    this.adService.delete(this.adToDelete.id).subscribe(() => {
      this.showDeleteConfirm = false; this.loadAds();
    });
  }

  // ════════════════════════════════════════════════════
  //  Video Modal
  // ════════════════════════════════════════════════════
  openVideoModal(ad: AdvertisementDto): void {
    this.selectedAdForVideo = ad;
    this.showVideoModal     = true;
    this.resetUploadState();
  }

  closeVideoModal(): void {
    if (this.isUploadingVideo && this.currentUploadId) {
      this.mediaService.cancelUploadByUploadId(this.currentUploadId).subscribe({ error: () => {} });
    }
    this.showVideoModal     = false;
    this.selectedAdForVideo = null;
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
    if (!this.selectedVideoFile || !this.selectedAdForVideo) return;

    const file        = this.selectedVideoFile;
    const refId       = this.selectedAdForVideo.id;
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
          this.mediaService.uploadChunk({
            uploadId,
            chunkIndex:       index,
            totalChunks,
            chunkData:        chunkFile,
            originalFileName: file.name,
            refId,
            type:             3,   // Advertisement = 3
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

          this.loadAds();
          if (response.data) {
            const idx = this.ads.findIndex(a => a.id === this.selectedAdForVideo!.id);
            if (idx !== -1) this.ads[idx] = { ...this.ads[idx], videoUrl: response.data };
          }
        }
      }
    } catch (err: any) {
      if (this.currentUploadId) {
        this.mediaService.cancelUploadByUploadId(this.currentUploadId).subscribe({ error: () => {} });
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
  //  Form Logic & Helpers
  // ════════════════════════════════════════════════════
  setupFormLogic(): void {
    ['youTubeVideoUrl', 'driveVideoUrl'].forEach(field => {
      this.adForm.get(field)?.valueChanges.subscribe(value => {
        if (value?.trim()) this.adForm.get('imageUrl')?.setValue(null);
      });
    });
    this.adForm.get('imageUrl')?.valueChanges.subscribe(value => {
      if (value) {
        this.adForm.get('youTubeVideoUrl')?.disable({ emitEvent: false });
        this.adForm.get('driveVideoUrl')?.disable({ emitEvent: false });
      } else {
        this.adForm.get('youTubeVideoUrl')?.enable({ emitEvent: false });
        this.adForm.get('driveVideoUrl')?.enable({ emitEvent: false });
      }
    });
  }

  toggleImageField(enable: boolean): void {
    const ctrl = this.adForm.get('imageUrl');
    enable ? ctrl?.enable() : ctrl?.disable();
  }

  removeImage(): void {
    this.adForm.get('imageUrl')?.setValue('');
    this.adForm.get('youTubeVideoUrl')?.enable();
    this.adForm.get('driveVideoUrl')?.enable();
  }

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