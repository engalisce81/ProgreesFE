import { PermissionService } from '@abp/ng.core';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GradeLevelDto, GradeLevelService, CreateUpdateGradeLevelDto } from '@proxy/dev/acadmy/universites';

@Component({
  selector: 'app-list-gradelevel',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './list-gradelevel.component.html',
  styleUrl: './list-gradelevel.component.scss'
})
export class ListGradelevelComponent implements OnInit {
  gradeLevels: any[] = [];
  loading = false;
  search = '';
  collegeId!: string;
   private permissionService = inject(PermissionService);
    hasCreatePermission = this.permissionService.getGrantedPolicy('Acadmy.GradeLevels.Create');
    hasEditPermission = this.permissionService.getGrantedPolicy('Acadmy.GradeLevels.Edit');
    hasDeletePermission = this.permissionService.getGrantedPolicy('Acadmy.GradeLevels.Delete');
    

  // Modal & Form States
  showFormModal = false;
  showDeleteConfirm = false;
  isEditMode = false;
  gradeLevelForm: FormGroup;
  selectedGradeId: string | null = null;
  gradeLevelToDelete: GradeLevelDto | null = null;

  constructor(
    private fb: FormBuilder,
    private gradeLevelService: GradeLevelService,
    private route: ActivatedRoute
  ) {
    this.gradeLevelForm = this.fb.group({
      name: ['', Validators.required],
      collegeId: ['']
    });
  }

  ngOnInit(): void {
    // جلب الـ collegeId من الـ URL (تأكد أن اسم البارامتر في الروتينج 'id')
    this.collegeId = this.route.snapshot.paramMap.get('collegeId') ?? '';
    this.loadGradeLevels();
  }

  loadGradeLevels(): void {
    this.loading = true;
    this.gradeLevelService.getList(1, 100, this.search, this.collegeId).subscribe({
      next: (res) => {
        this.gradeLevels = res.items.map(gl => ({ ...gl, showMenu: false }));
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onSearchChange(): void {
    this.loadGradeLevels();
  }

  openCreateModal() {
    this.isEditMode = false;
    this.gradeLevelForm.reset({ collegeId: this.collegeId });
    this.showFormModal = true;
  }

  openEditModal(level: GradeLevelDto) {
    this.isEditMode = true;
    this.selectedGradeId = level.id;
    this.gradeLevelForm.patchValue({
      name: level.name,
      collegeId: this.collegeId
    });
    this.showFormModal = true;
  }

  closeFormModal() {
    this.showFormModal = false;
    this.selectedGradeId = null;
  }

  submitForm() {
    if (this.gradeLevelForm.invalid) return;
    this.loading = true;

    const dto: CreateUpdateGradeLevelDto = {
      ...this.gradeLevelForm.value,
      collegeId: this.collegeId,
      collegeName:"name"
    };

    const request = this.isEditMode 
      ? this.gradeLevelService.update(this.selectedGradeId!, dto)
      : this.gradeLevelService.create(dto);

    request.subscribe({
      next: () => {
        this.loadGradeLevels();
        this.closeFormModal();
      },
      error: (err) => {
        this.loading = false;
        alert('Error: ' + err.message);
      }
    });
  }

  confirmDelete(level: GradeLevelDto) {
    this.gradeLevelToDelete = level;
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.gradeLevelToDelete = null;
  }

  deleteGradeLevel() {
    if (!this.gradeLevelToDelete) return;
    this.gradeLevelService.delete(this.gradeLevelToDelete.id).subscribe({
      next: () => {
        this.loadGradeLevels();
        this.showDeleteConfirm = false;
      },
      error: (err) => alert('Delete failed: ' + err.message)
    });
  }
}