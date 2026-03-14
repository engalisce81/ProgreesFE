import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChapterDto, ChapterService, CreateUpdateChapterDto } from '@proxy/dev/acadmy/chapters';
import { CourseService } from '@proxy/dev/acadmy/courses';
import { LookupDto } from '@proxy/dev/acadmy/look-up';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-chapter',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './list-chapter.component.html',
  styleUrl: './list-chapter.component.scss'
})
export class ListChapterComponent implements OnInit {
  courseId: string = '';
  chapters: (ChapterDto & { showMenu?: boolean })[] = [];
  courses: LookupDto[] = [];
  
  loading = false;
  search = '';
  totalCount = 0;
  pageSize = 10;
  pageIndex = 1;

  // Modal Controls
  showFormModal = false;
  isEditMode = false;
  chapterForm: FormGroup;
  selectedChapterId: string | null = null;

  showDeleteConfirm = false;
  chapterToDelete!: ChapterDto;

  constructor(
    private chapterService: ChapterService,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.chapterForm = this.fb.group({
      name: ['', Validators.required],
      courseId: ['', Validators.required],
      isFree: [false]
    });
  }

  ngOnInit(): void {
    // Correctly getting courseId from route parameters
    this.courseId = this.route.snapshot.paramMap.get('courseId') || '';
    
    if (this.courseId) {
      this.loadChapters();
      this.loadCourses();
    }
  }

  loadCourses() {
    this.courseService.getCoursesList().subscribe(res => this.courses = res.items);
  }

  loadChapters(): void {
    this.loading = true;
    this.chapterService.getList(this.pageIndex, this.pageSize, this.search, this.courseId).subscribe({
      next: (res) => {
        this.chapters = res.items.map(c => ({ ...c, showMenu: false }));
        this.totalCount = res.totalCount;
        this.loading = false;
      },
      error: () => this.loading = false,
    });
  }

  openCreateModal() {
    this.isEditMode = false;
    this.selectedChapterId = null;
    // Pre-populate courseId from the URL param
    this.chapterForm.reset({ 
      name: '',
      courseId: this.courseId, 
      isFree: false 
    });
    this.showFormModal = true;
  }

  openEditModal(chapter: ChapterDto) {
    this.isEditMode = true;
    this.selectedChapterId = chapter.id;
    this.chapterForm.patchValue({
      name: chapter.name,
      courseId: this.courseId, // Ensure it stays linked to the current course
      isFree: chapter.isFree
    });
    this.showFormModal = true;
  }

  closeFormModal() {
    this.showFormModal = false;
    this.chapterForm.reset();
  }

  submitForm() {
    if (this.chapterForm.invalid) return;

    const dto: CreateUpdateChapterDto = this.chapterForm.value;
    this.loading = true;

    const request = this.isEditMode && this.selectedChapterId
      ? this.chapterService.update(this.selectedChapterId, dto)
      : this.chapterService.create(dto);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.closeFormModal();
        this.loadChapters();
      },
      error: (err) => {
        this.loading = false;
        alert('Error saving chapter: ' + err.message);
      }
    });
  }

  onSearchChange() { 
    this.pageIndex = 1; 
    this.loadChapters(); 
  }

  onPageChange(page: number) { 
    if (page >= 1 && page <= this.totalPages) { 
      this.pageIndex = page; 
      this.loadChapters(); 
    } 
  }

  get totalPages(): number { 
    return Math.ceil(this.totalCount / this.pageSize); 
  }

  get pages(): number[] {
    let p: number[] = [];
    for (let i = Math.max(1, this.pageIndex - 2); i <= Math.min(this.totalPages, this.pageIndex + 2); i++) {
      p.push(i);
    }
    return p;
  }

  confirmDelete(chapter: ChapterDto) { 
    this.chapterToDelete = chapter; 
    this.showDeleteConfirm = true; 
  }

  cancelDelete() { 
    this.showDeleteConfirm = false; 
  }

  deleteChapter() {
    this.chapterService.delete(this.chapterToDelete.id).subscribe(() => {
      this.showDeleteConfirm = false;
      this.loadChapters();
    });
  }
}