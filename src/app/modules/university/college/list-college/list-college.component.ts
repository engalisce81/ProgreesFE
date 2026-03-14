import { PermissionService } from '@abp/ng.core';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CollegeDto, CollegeService, CreateUpdateCollegeDto } from '@proxy/dev/acadmy/universites';

@Component({
  selector: 'app-list-college',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './list-college.component.html',
  styleUrl: './list-college.component.scss'
})
export class ListCollegeComponent implements OnInit {
  colleges: any[] = [];
  loading = false;
  search = '';
  universityId!: string;
  private permissionService = inject(PermissionService);
  hasCreatePermission = this.permissionService.getGrantedPolicy('Acadmy.Colleges.Create');
  hasEditPermission = this.permissionService.getGrantedPolicy('Acadmy.Colleges.Edit');
  hasDeletePermission = this.permissionService.getGrantedPolicy('Acadmy.Colleges.Delete');
  

  // Modal & Form States
  showFormModal = false;
  showDeleteConfirm = false;
  isEditMode = false;
  collegeForm: FormGroup;
  selectedCollegeId: string | null = null;
  collegeToDelete: CollegeDto | null = null;

  constructor(
    private fb: FormBuilder,
    private collegeService: CollegeService,
    private route: ActivatedRoute
  ) {
    this.collegeForm = this.fb.group({
      name: ['', Validators.required],
      gradeLevelCount: [0, [Validators.required, Validators.min(1)]],
      universityId: [''] // سيتم ملئه من البارامتر
    });
  }

  ngOnInit(): void {
    // جلب الـ universityId من الرابط
    this.universityId = this.route.snapshot.paramMap.get('id')!;
    this.loadColleges();
  }

  loadColleges(): void {
    this.loading = true;
    // نمرر الـ universityId للفلترة إذا كان الـ API يدعم ذلك، أو نعتمد على الـ search
    this.collegeService.getList(1, 100, this.search, this.universityId).subscribe({
      next: (res) => {
        this.colleges = res.items.map(c => ({ ...c, showMenu: false }));
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onSearchChange(): void {
    this.loadColleges();
  }

  openCreateModal() {
    this.isEditMode = false;
    this.collegeForm.reset({ universityId: this.universityId, gradeLevelCount: 0 });
    this.showFormModal = true;
  }

  openEditModal(college: CollegeDto) {
    this.isEditMode = true;
    this.selectedCollegeId = college.id;
    this.collegeForm.patchValue({
      name: college.name,
      gradeLevelCount: 0,
      universityId: this.universityId
    });
    this.showFormModal = true;
  }

  closeFormModal() {
    this.showFormModal = false;
    this.selectedCollegeId = null;
  }

  submitForm() {
    if (this.collegeForm.invalid) return;
    this.loading = true;
    
    const dto: CreateUpdateCollegeDto = this.collegeForm.value;
    dto.universityId = this.universityId; // التأكيد على ربطها بالجامعة

    const request = this.isEditMode 
      ? this.collegeService.update(this.selectedCollegeId!, dto)
      : this.collegeService.create(dto);

    request.subscribe({
      next: () => {
        this.loadColleges();
        this.closeFormModal();
      },
      error: (err) => {
        this.loading = false;
        alert('حدث خطأ: ' + err.message);
      }
    });
  }

  confirmDelete(college: CollegeDto) {
    this.collegeToDelete = college;
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.collegeToDelete = null;
  }

  deleteCollege() {
    if (!this.collegeToDelete) return;
    this.collegeService.delete(this.collegeToDelete.id).subscribe({
      next: () => {
        this.loadColleges();
        this.showDeleteConfirm = false;
      }
    });
  }
}


