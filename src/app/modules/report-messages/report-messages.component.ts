// report-messages.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ChatReportAdminService } from '@proxy/dev/acadmy/chats';
import { GetReportsInputDto, UpdateReportStatusDto } from '@proxy/dev/acadmy/dtos/request/chats';
import { ChatMessageReportDto } from '@proxy/dev/acadmy/dtos/response/chats';

// واجهة ممتدة لإضافة خاصية showMenu
export interface ReportWithMenu extends ChatMessageReportDto {
  showMenu?: boolean;
}

@Component({
  selector: 'app-report-messages',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, DatePipe],
  templateUrl: './report-messages.component.html',
  styleUrl: './report-messages.component.scss'
})
export class ReportMessagesComponent implements OnInit {
  // Data Properties - استخدام الواجهة الممتدة
  reports: ReportWithMenu[] = [];
  loading = false;
  search = '';
  statusFilter = '';
  
  // Pagination
  totalCount = 0;
  pageSize = 10;
  pageIndex = 1;

  // Details Modal
  showDetailsModal = false;
  selectedReport: ReportWithMenu | null = null;

  // Status Update Modal
  showStatusModal = false;
  statusForm: FormGroup;
  statusOptions = [
    { value: 0, label: 'Pending' },
    { value: 1, label: 'Under Review' },
    { value: 2, label: 'Resolved' },
    { value: 3, label: 'Dismissed' }
  ];

  // Delete Confirmation
  showDeleteModal = false;
  reportToDelete: ReportWithMenu | null = null;

  constructor(
    private fb: FormBuilder,
    private reportService: ChatReportAdminService
  ) {
    this.statusForm = this.fb.group({
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports() {
    this.loading = true;
    
    const input: GetReportsInputDto = {
      filter: this.search || undefined,
      status: this.statusFilter ? Number(this.statusFilter) : undefined,
      sorting: 'creationTime desc',
      skipCount: (this.pageIndex - 1) * this.pageSize,
      maxResultCount: this.pageSize
    };

    this.reportService.getList(input).subscribe({
      next: (res) => {
        this.reports = res.items!.map(r => ({ 
          ...r, 
          showMenu: false 
        } as ReportWithMenu));
        this.totalCount = res.totalCount!;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error loading reports:', err);
      }
    });
  }

  // Pagination Logic
  get totalPages(): number { 
    return Math.ceil(this.totalCount / this.pageSize); 
  }

  onPageChange(page: number) { 
    this.pageIndex = page; 
    this.loadReports(); 
  }

  onSearchChange() { 
    this.pageIndex = 1; 
    this.loadReports(); 
  }

  onStatusFilterChange() {
    this.pageIndex = 1;
    this.loadReports();
  }

  // Get Status Badge Class
  getStatusClass(status: number): string {
    switch(status) {
      case 0: return 'status-pending';
      case 1: return 'status-review';
      case 2: return 'status-resolved';
      case 3: return 'status-dismissed';
      default: return 'status-pending';
    }
  }

  getStatusLabel(status: number): string {
    switch(status) {
      case 0: return 'Pending';
      case 1: return 'Under Review';
      case 2: return 'Resolved';
      case 3: return 'Dismissed';
      default: return 'Unknown';
    }
  }

  // Details Modal
  openDetailsModal(report: ReportWithMenu) {
    this.selectedReport = report;
    this.showDetailsModal = true;
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
    this.selectedReport = null;
  }

  // Status Update Modal
  openStatusModal(report: ReportWithMenu) {
    this.selectedReport = report;
    this.statusForm.patchValue({
      status: report.status
    });
    this.showStatusModal = true;
  }

  closeStatusModal() {
    this.showStatusModal = false;
    this.selectedReport = null;
    this.statusForm.reset({ status: '' });
  }

  submitStatusUpdate() {
    if (this.statusForm.invalid || !this.selectedReport) return;

    this.loading = true;
    const input: UpdateReportStatusDto = {
      status: this.statusForm.value.status
    };

    this.reportService.updateStatus(this.selectedReport.id!, input).subscribe({
      next: () => {
        this.loadReports();
        this.closeStatusModal();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error updating status:', err);
        alert('Failed to update status');
      }
    });
  }

  // Delete Operations
  openDeleteModal(report: ReportWithMenu) {
    this.reportToDelete = report;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.reportToDelete = null;
  }

  confirmDeleteReport() {
    if (!this.reportToDelete) return;

    this.loading = true;
    this.reportService.deleteReportedMessage(this.reportToDelete.id!).subscribe({
      next: () => {
        this.loadReports();
        this.closeDeleteModal();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error deleting reported message:', err);
        alert('Failed to delete reported message');
      }
    });
  }

  // Toggle Menu
  toggleMenu(report: ReportWithMenu) {
    // Close all other menus first
    this.reports.forEach(r => {
      if (r.id !== report.id) {
        r.showMenu = false;
      }
    });
    report.showMenu = !report.showMenu;
  }

  // Close all menus
  closeAllMenus() {
    this.reports.forEach(r => {
      r.showMenu = false;
    });
  }

  // Format Date
  formatDate(date?: string): string {
    if (!date) return '';
    return new Date(date).toLocaleString();
  }

  // Track by function for better performance
  trackByReportId(index: number, report: ReportWithMenu): string | undefined {
    return report.id;
  }
}