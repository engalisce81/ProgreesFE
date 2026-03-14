import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListQuestionbankComponent } from './list-questionbank.component';

describe('ListQuestionbankComponent', () => {
  let component: ListQuestionbankComponent;
  let fixture: ComponentFixture<ListQuestionbankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListQuestionbankComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListQuestionbankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
