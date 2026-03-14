import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankQuestionComponent } from './bank-question.component';

describe('BankQuestionComponent', () => {
  let component: BankQuestionComponent;
  let fixture: ComponentFixture<BankQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankQuestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
