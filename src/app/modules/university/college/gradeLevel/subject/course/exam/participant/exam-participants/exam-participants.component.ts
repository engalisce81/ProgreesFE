import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ExamStudentDto } from '@proxy/dev/acadmy/dtos/response/exams';
import { ExamService } from '@proxy/dev/acadmy/exams';

@Component({
  selector: 'app-exam-participants',
  templateUrl: './exam-participants.component.html',
  styleUrls: ['./exam-participants.component.scss'],
  imports:[CommonModule ,FormsModule,RouterLink]
})
export class ExamParticipantsComponent implements OnInit {
  participants: ExamStudentDto[] = [];
  examId: string;
  loading = false;
  search = '';
  pageIndex = 1;
  pageSize = 10;
  totalCount = 0;

  constructor(
    private examService: ExamService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.examId = this.route.snapshot.params['examId'];
    this.loadParticipants();
  }

  loadParticipants() {
    this.loading = true;
    this.examService.getExamParticipants(this.pageIndex, this.pageSize, this.search, this.examId)
      .subscribe(result => {
        this.participants = result.items;
        this.totalCount = result.totalCount;
        this.loading = false;
      });
  }

  onSearchKeyup(event: any) {
    this.search = event.target.value;
    this.pageIndex = 1;
    this.loadParticipants();
  }

  onPageChange(index: number) {
    this.pageIndex = index;
    this.loadParticipants();
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  get pages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) pages.push(i);
    return pages;
  }
}