import { CoreModule, PermissionService } from '@abp/ng.core';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UniversityDto, UniversityService, CreateUpdateUniversityDto } from '@proxy/dev/acadmy/universites';

@Component({
  selector: 'app-list-university',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink ,CoreModule],
  templateUrl: './list-university.component.html',
  styleUrl: './list-university.component.scss' // تأكد أن الـ SCSS هو اللي فيه الاستايل المودرن
})
export class ListUniversityComponent implements OnInit {
  universities: any[] = [];
  loading = false;
  search = '';
  private permissionService = inject(PermissionService);
  hasCreatePermission = this.permissionService.getGrantedPolicy('Acadmy.Universites.Create');
  hasEditPermission = this.permissionService.getGrantedPolicy('Acadmy.Universites.Edit');
  hasDeletePermission = this.permissionService.getGrantedPolicy('Acadmy.Universites.Delete');
  
  // Modal states
  showFormModal = false;
  showDeleteConfirm = false;
  isEditMode = false;
  
  universityForm: FormGroup;
  universityToDelete: UniversityDto | null = null;
  selectedUniversityId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private universityService: UniversityService
  ) {
    this.universityForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUniversities();
  }

  loadUniversities(): void {
    this.loading = true;
    this.universityService.getList(1, 100, this.search).subscribe({
      next: (res) => {
        this.universities = res.items.map(u => ({ ...u, showMenu: false }));
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onSearchChange(): void {
    this.loadUniversities();
  }

  // Logic لفتح الـ Modal في حالة الكريت
  openCreateModal() {
    this.isEditMode = false;
    this.universityForm.reset();
    this.showFormModal = true;
  }

  // Logic لفتح الـ Modal في حالة الأبديت
  openEditModal(uni: UniversityDto) {
    this.isEditMode = true;
    this.selectedUniversityId = uni.id;
    this.universityForm.patchValue({ name: uni.name });
    this.showFormModal = true;
  }

  closeFormModal() {
    this.showFormModal = false;
    this.selectedUniversityId = null;
  }

  submitForm() {
    if (this.universityForm.invalid) return;
    
    this.loading = true;
    const dto: CreateUpdateUniversityDto = this.universityForm.value;

    const request = this.isEditMode 
      ? this.universityService.update(this.selectedUniversityId!, dto)
      : this.universityService.create(dto);

    request.subscribe({
      next: () => {
        this.loadUniversities();
        this.closeFormModal();
      },
      error: (err) => {
        this.loading = false;
        alert('Error: ' + err.message);
      }
    });
  }

  confirmDelete(uni: UniversityDto) {
    this.universityToDelete = uni;
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.universityToDelete = null;
  }

  deleteUniversity() {
    if (!this.universityToDelete) return;
    this.universityService.delete(this.universityToDelete.id).subscribe({
      next: () => {
        this.loadUniversities();
        this.showDeleteConfirm = false;
      }
    });
  }
}