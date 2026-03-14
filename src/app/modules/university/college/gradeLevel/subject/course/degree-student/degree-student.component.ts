import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '@proxy/dev/acadmy/courses';
import { LectureWithQuizzesDto } from '@proxy/dev/acadmy/lectures';


@Component({
  selector: 'app-degree-student',
  imports: [],
  templateUrl: './degree-student.component.html',
  styleUrl: './degree-student.component.scss'
})
export class DegreeStudentComponent {
courseId!: string;
  userId!: string;
  studentLectures: LectureWithQuizzesDto[] = [];
  totalCount = 0;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('courseId')!;
    this.userId = this.route.snapshot.paramMap.get('userId')!;
    this.loadStudentQuizzes();
  }

  loadStudentQuizzes(): void {
    this.isLoading = true;

    this.courseService.getStudentQuizzesByCourse(this.courseId, this.userId, 1, 50)
      .subscribe({
        next: (res) => {
          this.studentLectures = res.items ?? [];
          this.totalCount = res.totalCount ?? 0;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('❌ Error loading quizzes:', err);
          this.isLoading = false;
        }
      });
  }
}
