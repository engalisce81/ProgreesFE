import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CourseService, CreateUpdateCourseDto } from '@proxy/dev/acadmy/courses';
import { LookupDto } from '@proxy/dev/acadmy/look-up';
import { MediaItemService } from '@proxy/dev/acadmy/media-items';
import { SubjectService } from '@proxy/dev/acadmy/universites';
import { Location } from '@angular/common'; // استيراد Location

// التأكد من تطابق الأنواع مع الـ Create
export enum CourseType { General = 0, Quiz = 1, Pdf = 2 }

@Component({
  selector: 'app-update-course',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './update-course.component.html',
  styleUrl: './update-course.component.scss'
})
export class UpdateCourseComponent implements OnInit {
  courseForm: FormGroup;
  loading = false;
  subjects: LookupDto[] = [];
  courseId!: string;
  subjectIdFromRoute: string = '';
  collegeIdFromRoute: string = '';
  gradeLevelIdFromRoute: string = ''; // أضفناه لاكتمال الرابط الهرمي
  private location = inject(Location); // حقن الخدمة
  // ملفات الرفع والمعاينة
  pdfFile: File | null = null;
  pdfFileName: string | null = null;
  logoFile: File | null = null;
  logoPreview: string | ArrayBuffer | null = null;

  // إدارة التابات (تلقائياً سيتم تحديدها عند تحميل البيانات)
  selectedTab: CourseType = CourseType.General;
  courseTypes = CourseType;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private subjectService: SubjectService,
    private uploadService: MediaItemService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.courseForm = this.fb.group({
      name: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      youTubeVideoUrl: [""],
      driveVideoUrl: [""],
      isActive: [true],
      isLifetime: [false],
      showSubscriberCount: [true], // الحقل الجديد
      durationInDays: [0],
      isPdf: [false],
      isQuiz: [false],
      infos: this.fb.array([]) // سيتم ملؤه من البيانات القادمة
    });
  }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.params['courseId'];
    this.subjectIdFromRoute = this.route.snapshot.params['subjectId'];
    this.collegeIdFromRoute = this.route.snapshot.params['collegeId'];
    this.gradeLevelIdFromRoute = this.route.snapshot.params['gradeLevelId'];

    this.loadCourseData();
  }

  get infos(): FormArray {
    return this.courseForm.get('infos') as FormArray;
  }

  // منطق التبديل بين التابات
  selectTab(type: CourseType) {
    this.selectedTab = type;
    this.courseForm.patchValue({
      isPdf: type === CourseType.Pdf,
      isQuiz: type === CourseType.Quiz
    });
  }


  loadCourseData() {
    this.courseService.get(this.courseId).subscribe({
      next: (course) => {
        const data = course.data;

        // 1. تحديد التابة النشطة بناءً على نوع الكورس المسترجع
        if (data.isPdf) this.selectedTab = CourseType.Pdf;
        else if (data.isQuiz) this.selectedTab = CourseType.Quiz;
        else this.selectedTab = CourseType.General;

        // 2. تحديث الفورم
        this.courseForm.patchValue({
          name: data.name,
          title: data.title,
          description: data.description,
          price: data.price,
          subjectId: data.subjectId,
          youTubeVideoUrl: data.youTubeVideoUrl,
          driveVideoUrl: data.driveVideoUrl,
          showSubscriberCount: data.showSubscriberCount, // تعبئة القيمة من الداتابيز
          isActive: data.isActive,
          isLifetime: data.isLifetime,
          durationInDays: data.durationInDays,
          isPdf: data.isPdf,
          isQuiz: data.isQuiz
        });

        // 3. عرض اللوجو القديم
        this.logoPreview = data.logoUrl || null;
        this.pdfFileName = data.pdfUrl ? 'Current PDF Document' : null;

        // 4. ملء الـ Infos Array
        this.infos.clear();
        if (data.infos?.length) {
          data.infos.forEach(info => {
            this.infos.push(this.fb.control(info, Validators.required));
          });
        } else {
          this.addInfo(); // حقل فارغ لو مفيش بيانات
        }
      },
      error: (err) => alert('Error loading course: ' + err.message)
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.logoFile = input.files[0];
    const reader = new FileReader();
    reader.onload = e => this.logoPreview = e.target?.result;
    reader.readAsDataURL(this.logoFile);
  }

  onPdfSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.pdfFile = input.files[0];
    this.pdfFileName = this.pdfFile.name;
  }

  addInfo() {
    this.infos.push(this.fb.control('', Validators.required));
  }

  removeInfo(index: number) {
    if (this.infos.length > 1) this.infos.removeAt(index);
  }

  async submit() {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      alert('Please check required fields');
      return;
    }

    this.loading = true;
    try {
      let finalLogoUrl = (this.logoPreview as string) || '';
      let finalPdfUrl = this.courseForm.get('pdfUrl')?.value || '';

      // رفع لوجو جديد لو المستخدم اختار ملف
      if (this.logoFile) {
        const res = await this.uploadService.uploadImage(this.logoFile).toPromise();
        finalLogoUrl = res.data;
      }

      // رفع PDF جديد لو التابة PDF والمستخدم اختار ملف
      if (this.selectedTab === CourseType.Pdf && this.pdfFile) {
        const res = await this.uploadService.uploadImage(this.pdfFile).toPromise();
        finalPdfUrl = res.data;
      }

      const dto: CreateUpdateCourseDto = {
        ...this.courseForm.value,
        logoUrl: finalLogoUrl,
        collegeId: this.collegeIdFromRoute,
        subjectId: this.subjectIdFromRoute,
        pdfUrl: finalPdfUrl,
        isPdf: this.selectedTab === CourseType.Pdf,
        isQuiz: this.selectedTab === CourseType.Quiz,
        infos: this.infos.value.filter((i: string) => i && i.trim() !== '')
      };
      console.log("Submitting with CollegeId:", this.collegeIdFromRoute);
      this.courseService.update(this.courseId, dto).subscribe({
        next: () => {
          this.loading = false;
          //this.router.navigate(['/courses']);
          this.back();
        },
        error: (err) => {
          this.loading = false;
          alert('Update Error: ' + err.message);
        }
      });

    } catch (error) {
      this.loading = false;
      alert('Upload Error: ' + error);
    }
  }

  back(){
      this.location.back();
  }
}

