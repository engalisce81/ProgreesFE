import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamParticipantsComponent } from './exam-participants.component';

describe('ExamParticipantsComponent', () => {
  let component: ExamParticipantsComponent;
  let fixture: ComponentFixture<ExamParticipantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamParticipantsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
