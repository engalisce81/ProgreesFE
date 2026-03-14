import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEnrollmentComponent } from './list-enrollment.component';

describe('ListEnrollmentComponent', () => {
  let component: ListEnrollmentComponent;
  let fixture: ComponentFixture<ListEnrollmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListEnrollmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
