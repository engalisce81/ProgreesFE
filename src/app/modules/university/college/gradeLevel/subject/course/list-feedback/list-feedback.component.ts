import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PagedResultDto } from '@abp/ng.core';
import { FeedbackDto } from '@proxy/dev/acadmy/dtos/response/courses';
import { CourseFeedbackService } from '@proxy/dev/acadmy/services/courses/dev/acadmy/services/courses';

@Component({
  selector: 'app-list-feedback',
  templateUrl: './list-feedback.component.html',
  styleUrls: ['./list-feedback.component.scss']
})
export class ListFeedbackComponent implements OnInit {
  courseId: string = '';
  feedbacks: FeedbackDto[] = [];
  totalCount = 0;
  pageSize = 10;
  currentPage = 1; 

  loading = false;
  isAcceptTab = true;

  constructor(
    private feedbackService: CourseFeedbackService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('courseId') || '';
    if (this.courseId) {
      this.loadFeedbacks();
    }
  }

  loadFeedbacks() {
    this.loading = true;
    this.feedbackService.getFeedbacksByCourseIdByCourseIdAndPageNumberAndPageSizeAndIsAccept(
      this.courseId,
      this.currentPage,
      this.pageSize,
      this.isAcceptTab
    ).subscribe({
      next: (res: PagedResultDto<FeedbackDto>) => {
        this.feedbacks = res.items || [];
        this.totalCount = res.totalCount || 0;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.feedbacks = [];
      }
    });
  }

  switchTab(status: boolean) {
    if (this.isAcceptTab === status) return;
    this.isAcceptTab = status;
    this.currentPage = 1; 
    this.loadFeedbacks();
  }

  handleAccept(id: string, status: boolean) {
    // يمكنك استبدال confirm بـ SweetAlert هنا لاحقاً
    if (confirm("Are you sure you want to change this feedback status?")) {
      this.feedbackService.acceptFeedback(id, status).subscribe(() => {
        this.loadFeedbacks();
      });
    }
  }

  handleDelete(id: string) {
    if (confirm("This action cannot be undone. Delete this feedback?")) {
      this.feedbackService.delete(id).subscribe(() => {
        this.loadFeedbacks();
      });
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadFeedbacks();
  }
}