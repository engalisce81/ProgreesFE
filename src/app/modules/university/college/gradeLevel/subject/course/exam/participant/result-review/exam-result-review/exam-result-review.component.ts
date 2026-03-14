import { CoreModule } from '@abp/ng.core';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamStudentResultDto } from '@proxy/dev/acadmy/dtos/response/exams';
import { ExamService } from '@proxy/dev/acadmy/exams';

@Component({
  selector: 'app-exam-result-review',
  templateUrl: './exam-result-review.component.html',
  styleUrls: ['./exam-result-review.component.scss'],
  imports:[CoreModule,CommonModule]
})
export class ExamResultReviewComponent implements OnInit {
  result: ExamStudentResultDto;
  isLoading = true;
  examId: string;
  userId: string;

  constructor(
    private examService: ExamService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.examId = this.route.snapshot.params['examId'];
    this.userId = this.route.snapshot.params['userId'];
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.examService.getStudentExamResult(this.examId, this.userId).subscribe(res => {
      // ملحوظة: الـ Service بترجع ResponseApi، فتأكد من سحب الـ data
      this.result = res.data; 
      this.isLoading = false;
    });
  }
}