import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSubjectComponent } from './list-subject.component';

describe('ListSubjectComponent', () => {
  let component: ListSubjectComponent;
  let fixture: ComponentFixture<ListSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListSubjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
