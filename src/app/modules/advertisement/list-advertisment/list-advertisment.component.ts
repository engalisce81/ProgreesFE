import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MediaItemService } from '@proxy/dev/acadmy/media-items';
import { finalize } from 'rxjs/operators';
import { CreateUpdateAdvertisementDto } from '@proxy/dev/acadmy/dtos/request/advertisementes';
import { AdvertisementDto } from '@proxy/dev/acadmy/dtos/response/advertisementes';
import { AdvertisementService } from '@proxy/dev/acadmy/services';

@Component({
  selector: 'app-list-advertisement',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './list-advertisment.component.html',
  styleUrl: './list-advertisment.component.scss'
})
export class ListAdvertisementComponent implements OnInit {
  ads: (AdvertisementDto & { showMenu?: boolean })[] = [];
  loading = false;
  uploading = false;

  // Pagination & Search
  pageIndex = 1;
  pageSize = 10;
  totalCount = 0;

  // Modals
  showFormModal = false;
  showDeleteConfirm = false;
  isEditMode = false;
  selectedAdId: string | null = null;
  adToDelete!: AdvertisementDto;

  adForm: FormGroup;

  showVideoModal = false;
  selectedAdForVideo: AdvertisementDto | null = null;
  selectedVideoFile: File | null = null;
  isUploadingVideo = false;
  uploadComplete = false;
  uploadedVideoUrl: string | null = null;
  uploadError: string | null = null;

  constructor(
    private adService: AdvertisementService,
    private mediaService: MediaItemService,
    private fb: FormBuilder
  ) {
    this.adForm = this.fb.group({
      title: ['', Validators.required],
      imageUrl: [''],
      youTubeVideoUrl: [""],
      driveVideoUrl: [""],
      startDate: [null],
      endDate: [null],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadAds();
    this.setupFormLogic();

  }

  loadAds() {
    this.loading = true;
    this.adService.getActiveAdsList(this.pageIndex, this.pageSize)
      .pipe(finalize(() => this.loading = false))
      .subscribe(res => {
        this.ads = res.items.map(ad => ({ ...ad, showMenu: false }));
        this.totalCount = res.totalCount;
      });
  }

  // Handle Image Upload
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.uploading = true;
    this.mediaService.uploadImage(file).subscribe({
      next: (res) => {
        this.adForm.patchValue({ imageUrl: res.data });
        this.uploading = false;
      },
      error: () => {
        alert('Image upload failed');
        this.uploading = false;
      }
    });
  }

  openCreateModal() {
    this.isEditMode = false;
    this.selectedAdId = null;
    this.adForm.reset({ isActive: true });
    this.showFormModal = true;
  }

  openEditModal(ad: AdvertisementDto) {
    this.isEditMode = true;
    this.selectedAdId = ad.id;
    this.adForm.patchValue({
      title: ad.title,
      imageUrl: ad.imageUrl,
      targetUrl: ad.youTubeVideoUrl,
      startDate: ad.startDate ? ad.startDate.split('T')[0] : null,
      endDate: ad.endDate ? ad.endDate.split('T')[0] : null,
      isActive: ad.isActive
    });
    this.showFormModal = true;
  }


  deleteVideo(ad:AdvertisementDto): void {
    
        this.mediaService.deleteVideo(ad.id).subscribe(() => {
          this.loadAds();
        });
    
      }
  submitForm() {
    if (this.adForm.invalid) return;

    const dto: CreateUpdateAdvertisementDto = this.adForm.value;
    this.loading = true;

    const request = this.isEditMode && this.selectedAdId
      ? this.adService.update(this.selectedAdId, dto) // افترضت وجود ميثود update في الـ proxy
      : this.adService.create(dto);

    request.pipe(finalize(() => this.loading = false)).subscribe(() => {
      this.showFormModal = false;
      this.loadAds();
    });
  }

  confirmDelete(ad: AdvertisementDto) {
    this.adToDelete = ad;
    this.showDeleteConfirm = true;
  }

  deleteAd() {
    this.adService.delete(this.adToDelete.id).subscribe(() => {
      this.showDeleteConfirm = false;
      this.loadAds();
    });
  }

  openVideoModal(ad: AdvertisementDto) {
    this.selectedAdForVideo = ad;
    this.showVideoModal = true;
    this.selectedVideoFile = null;
    this.uploadComplete = false;
    this.uploadedVideoUrl = null;
    this.uploadError = null;
  }

  // دالة إغلاق المودال
  closeVideoModal() {
    this.showVideoModal = false;
    this.selectedAdForVideo = null;
    this.selectedVideoFile = null;
    this.isUploadingVideo = false;
    this.uploadComplete = false;
    this.uploadedVideoUrl = null;
    this.uploadError = null;
  }

  // دالة اختيار ملف الفيديو
  onVideoFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedVideoFile = file;
      this.uploadError = null;
    }
  }

  // دالة رفع الفيديو إلى السيرفر
  uploadVideoToServer() {
    if (!this.selectedVideoFile || !this.selectedAdForVideo) return;

    this.isUploadingVideo = true;
    this.uploadError = null;
    this.uploadComplete = false;

    // تجهيز DTO المطلوب لرفع الفيديو (نفس البنية المستخدمة في المحاضرات)
    const uploadDto: any = {
      videoFile: this.selectedVideoFile,
      type: 3, // قد يختلف الرقم حسب النظام (2 = فيديو إعلان مثلاً)
      refId: this.selectedAdForVideo.id // معرف الإعلان
    };

    this.mediaService.uploadVideo(uploadDto).subscribe({
      next: (response) => {
        this.isUploadingVideo = false;
        this.uploadComplete = true;
        // نفترض أن response.data يحتوي على رابط الفيديو المرفوع
        const videoUrl = response.data || response.message;
        this.uploadedVideoUrl = videoUrl || 'تم الرفع بنجاح';
        this.loadAds();

        // تحديث الإعلان في القائمة المحلية
        if (videoUrl) {
          const adIndex = this.ads.findIndex(ad => ad.id === this.selectedAdForVideo!.id);
          if (adIndex !== -1) {
            this.ads[adIndex] = { ...this.ads[adIndex], videoUrl };
          }
        }
      },
      error: (err) => {
        this.isUploadingVideo = false;
        this.uploadError = err.message || 'حدث خطأ أثناء رفع الفيديو';
      }
    });
  }


  setupFormLogic() {
  // مراقبة روابط الفيديو لتعطيل أو مسح الصورة
  const videoFields = ['youTubeVideoUrl', 'driveVideoUrl'];
  
  videoFields.forEach(field => {
    this.adForm.get(field)?.valueChanges.subscribe(value => {
      if (value && value.trim() !== '') {
        // إذا كتب المستخدم رابط فيديو، قم بمسح الصورة فوراً
        this.adForm.get('imageUrl')?.setValue(null);
        // يمكنك أيضاً إضافة منطق لتعطيل الحقل برمجياً
      }
    });
  });

  // مراقبة الصورة لتعطيل روابط الفيديو (المنطق العكسي)
  this.adForm.get('imageUrl')?.valueChanges.subscribe(value => {
    if (value) {
      this.adForm.get('youTubeVideoUrl')?.disable({emitEvent: false});
      this.adForm.get('driveVideoUrl')?.disable({emitEvent: false});
    } else {
      this.adForm.get('youTubeVideoUrl')?.enable({emitEvent: false});
      this.adForm.get('driveVideoUrl')?.enable({emitEvent: false});
    }
  });
}

  toggleImageField(enable: boolean) {
    const imgControl = this.adForm.get('imageUrl');
    if (enable) imgControl?.enable();
    else imgControl?.disable();
  }

 removeImage() {
  // 1. مسح قيمة الصورة من الفورم
  this.adForm.get('imageUrl')?.setValue('');
  
  // 2. إعادة تفعيل حقول الفيديو التي قمنا بتعطيلها سابقاً
  this.adForm.get('youTubeVideoUrl')?.enable();
  this.adForm.get('driveVideoUrl')?.enable();

  // (اختياري) إذا كنت تريد تصفير مدخلات ملفات الفيديو أيضاً
  console.log('Image removed, video fields enabled.');
}
}