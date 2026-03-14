import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamResultReviewComponent } from './exam-result-review.component';

describe('ExamResultReviewComponent', () => {
  let component: ExamResultReviewComponent;
  let fixture: ComponentFixture<ExamResultReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamResultReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamResultReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
