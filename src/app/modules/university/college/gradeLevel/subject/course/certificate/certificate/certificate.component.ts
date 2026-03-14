import { Component, viewChild, signal, inject, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CourseCertificateService } from '@proxy/dev/acadmy/courses';
import * as pdfjsLib from 'pdfjs-dist';
import { CommonModule } from '@angular/common';

// إعداد الـ Worker الخاص بـ PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

@Component({
  selector: 'app-certificate',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certificate.component.html',
  styleUrl: './certificate.component.scss'
})
export class CertificateComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private certificateService = inject(CourseCertificateService);

  readonly pdfCanvas = viewChild<ElementRef<HTMLCanvasElement>>('pdfCanvas');

  courseId = signal<string | null>(null);
  pdfLoaded = signal(false);
  isLoading = signal(false);
  namePosition = signal({ x: 0, y: 0 });
  showMarker = signal(false);
  selectedFile: File | null = null;
  exampleName = signal('John Doe');

  // تتبع إذا كان هناك إعدادات موجودة مسبقاً
  existingConfig = signal(false);

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['courseId'];
      if (id) {
        this.courseId.set(id);
        this.loadExistingCertificate(id);
      }
    });
  }

  loadExistingCertificate(id: string) {
    this.isLoading.set(true);

    // تحميل التكوين أولاً
    this.certificateService.getByCourseId(id).subscribe({
      next: async (data) => {
        if (data) {
          // تحديث الإحداثيات من قاعدة البيانات
          this.namePosition.set({
            x: data.nameXPosition || 0,
            y: data.nameYPosition || 0
          });
          this.showMarker.set(true);
          this.existingConfig.set(true);

          // تحميل الـ PDF باستخدام دالة downloadCertificate
          await this.loadPdfFromService(id);
        } else {
          this.existingConfig.set(false);
          this.isLoading.set(false);
        }
      },
      error: (err) => {
        console.error('Error loading config:', err);
        this.existingConfig.set(false);
        this.isLoading.set(false);
      }
    });
  }

  // دالة لتحميل PDF من الخدمة
  async loadPdfFromService(courseId: string) {
    try {
      // استخدام دالة downloadCertificate التي ترجع Blob
      const blob = await this.certificateService.downloadCertificateToUpate(courseId).toPromise();

      if (blob) {
        await this.displayPdfFromBlob(blob);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);

      // محاولة بديلة باستخدام HTTP مباشرة (مع خيارات CORS)
      await this.tryAlternativeDownload(courseId);
    } finally {
      this.isLoading.set(false);
    }
  }

  // طريقة بديلة إذا فشلت الأولى
  async tryAlternativeDownload(courseId: string) {
    const url = `/api/app/course-certificate/download-certificate/${courseId}`;

    try {
      const blob = await this.http.get(url, {
        responseType: 'blob',
        withCredentials: true,
      }).toPromise();

      if (blob) {
        await this.displayPdfFromBlob(blob);
      }
    } catch (error) {
      console.error('Alternative download failed:', error);
    }
  }

  // عرض PDF من Blob
  async displayPdfFromBlob(blob: Blob) {
    try {
      // إنشاء Object URL من الـ Blob
      const url = URL.createObjectURL(blob);

      // تحميل وعرض الـ PDF
      await this.displayPdf(url, blob);

      // تنظيف الـ Object URL بعد الاستخدام
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('Error displaying PDF from blob:', error);
    }
  }

  async displayPdf(urlOrBlob: string | Blob, blob?: Blob) {
    try {
      this.pdfLoaded.set(true);

      // تأخير بسيط لضمان أن Angular قام برسم الـ Canvas في الـ DOM
      setTimeout(async () => {
        const canvas = this.pdfCanvas()?.nativeElement;
        if (!canvas) return;

        let loadingTask;

        // التعامل مع كلا النوعين (URL string أو Blob)
        if (typeof urlOrBlob === 'string') {
          loadingTask = pdfjsLib.getDocument(urlOrBlob);
        } else {
          loadingTask = pdfjsLib.getDocument(await this.blobToArrayBuffer(urlOrBlob));
        }

        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        const context = canvas.getContext('2d');
        if (!context) {
          console.error('Could not get canvas context');
          return;
        }

        const viewport = page.getViewport({ scale: 1.5 });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        await page.render(renderContext).promise;
      }, 100);
    } catch (error) {
      console.error('PDF Rendering error:', error);
      this.pdfLoaded.set(false);
    }
  }

  // تحويل Blob إلى ArrayBuffer
  private blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
  }

  // دالة اختيار ملف جديد من الجهاز
  async loadPdf(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.selectedFile = file;
    const url = URL.createObjectURL(file);
    await this.displayPdf(url);

    // تنظيف الـ Object URL بعد الاستخدام
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  selectPosition(event: MouseEvent) {
    if (!this.pdfLoaded()) return;
    const canvas = this.pdfCanvas()?.nativeElement;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    // حساب النسبة المئوية بدقة
    const xPercentRaw = ((event.clientX - rect.left) / rect.width) * 100;
    const yPercentRaw = ((event.clientY - rect.top) / rect.height) * 100;

    // السيرفر بيحتاج أرقام دقيقة، 4 أرقام عشرية ممتازة للـ PDF
    const xPercent = parseFloat(xPercentRaw.toFixed(4));
    const yPercent = parseFloat(yPercentRaw.toFixed(4));

    this.namePosition.set({ x: xPercent, y: yPercent });
    this.showMarker.set(true);
  }

  async saveConfig() {
    const id = this.courseId();
    if (!id) return;

    // التحقق من الملف في حالات مختلفة
    const hasExistingConfig = this.existingConfig();

    // حالة الإنشاء: يجب وجود ملف
    if (!hasExistingConfig && !this.selectedFile) {
      alert('يجب رفع ملف قالب الشهادة أولاً');
      return;
    }

    // حالة التعديل: إذا لم يتم اختيار ملف جديد، نستخدم الـ Blob الموجود
    let fileToUpload = this.selectedFile;

    if (!fileToUpload && hasExistingConfig) {
      try {
        // تحميل الملف الموجود من الخدمة لاستخدامه في التعديل
        const blob = await this.certificateService.downloadCertificateToUpate(id).toPromise();
        if (blob) {
          // تحويل Blob إلى File
          fileToUpload = new File([blob], 'existing-template.pdf', { type: 'application/pdf' });
        }
      } catch (error) {
        console.error('Error loading existing file:', error);
      }
    }

    // إذا لم يكن هناك ملف للرفع بعد كل المحاولات
    if (!fileToUpload) {
      alert('الملف مطلوب للحفظ. الرجاء رفع ملف قالب الشهادة.');
      return;
    }

    try {
      // استخدام دالة createOrUpdate من الخدمة
      await this.certificateService.createOrUpdate({
        courseId: id,
        nameXPosition: this.namePosition().x.toString(),
        nameYPosition: this.namePosition().y.toString(),
        templateFile: fileToUpload
      }).toPromise();


      // تحديث حالة الإعدادات
      this.existingConfig.set(true);

      // إعادة تحميل الشهادة بعد الحفظ
      await this.loadPdfFromService(id);
    } catch (error) {
      console.error('Error saving config:', error);

      // معالجة أخطاء محددة
      if (error.status === 400) {
        alert('خطأ في البيانات المرسلة. تأكد من صحة الملف والإحداثيات.');
      } else {
        alert('حدث خطأ أثناء الحفظ. الرجاء المحاولة مرة أخرى.');
      }
    }
  }

  // دالة مساعدة لعرض الـ Blob كـ PDF في نافذة جديدة
  openPdfInNewWindow(blob: Blob) {
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');

    // تنظيف الـ URL بعد فتح النافذة
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  }
}