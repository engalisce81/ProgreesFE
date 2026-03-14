import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService, CreateUpdateCourseDto } from '@proxy/dev/acadmy/courses';
import { LookupDto } from '@proxy/dev/acadmy/look-up';
import { MediaItemService } from '@proxy/dev/acadmy/media-items';
import { Location } from '@angular/common'; // استيراد Location
// تعريف الأنواع محلياً للتأكد من التزامن مع التابات
export enum CourseType { General = 0, Quiz = 1, Pdf = 2 }

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './create-course.component.html',
  styleUrl: './create-course.component.scss'
})
export class CreateCourseComponent implements OnInit {
  courseForm: FormGroup;
  loading = false;
  subjects: LookupDto[] = [];
  subjectIdFromRoute: string = '';
  collegeIdFromRoute: string = '';
    private location = inject(Location); // حقن الخدمة
  gradeLevelIdFromRoute: string = ''; // أضفناه لاكتمال الرابط الهرمي

  // ملفات الرفع
  pdfFile: File | null = null;
  pdfFileName: string | null = null;
  logoFile: File | null = null;
  logoPreview: string | ArrayBuffer | null = null;

  // إدارة التابات
  selectedTab: CourseType = CourseType.General;
  courseTypes = CourseType;
private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private courseService = inject(CourseService);
  private router = inject(Router);
  private uploadService = inject(MediaItemService);
  constructor(
   
  ) {
    this.courseForm = this.fb.group({
      name: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      youTubeVideoUrl: [""],
      driveVideoUrl:[""],
      isActive: [true],
      isLifetime: [false],
      durationInDays: [0],
      isPdf: [false],
      isQuiz: [false],
      showSubscriberCount: [true],
      infos: this.fb.array([this.fb.control('', Validators.required)])
    });
  }

  ngOnInit(): void {
    this.subjectIdFromRoute = this.route.snapshot.params['subjectId'];
    this.collegeIdFromRoute = this.route.snapshot.params['collegeId'];
    this.gradeLevelIdFromRoute = this.route.snapshot.params['gradeLevelId'];
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
      alert('Please check required fields');
      return;
    }

    this.loading = true;
    try {
      let logoUrl = '';
      let pdfUrl = '';

      // رفع اللوجو
      if (this.logoFile) {
        const res = await this.uploadService.uploadImage(this.logoFile).toPromise();
        logoUrl = res.data;
      }

      // رفع الملف لو التابة PDF
      if (this.selectedTab === CourseType.Pdf && this.pdfFile) {
        const res = await this.uploadService.uploadImage(this.pdfFile).toPromise();
        pdfUrl = res.data;
      }

      const dto: CreateUpdateCourseDto = {
        ...this.courseForm.value,
        logoUrl,
        pdfUrl,
        subjectId: this.subjectIdFromRoute,
        collegeId: this.collegeIdFromRoute,
        isPdf: this.selectedTab === CourseType.Pdf,
        isQuiz: this.selectedTab === CourseType.Quiz,
        infos: this.infos.value.filter((i: string) => i.trim() !== '')
      };

      this.courseService.create(dto).subscribe({
        next: () => {
          this.loading = false;
          this.back();
        },
        error: (err) => {
          this.loading = false;
          alert('Save Error: ' + err.message);
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