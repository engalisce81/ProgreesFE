import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRequestjoinComponent } from './list-requestjoin.component';

describe('ListRequestjoinComponent', () => {
  let component: ListRequestjoinComponent;
  let fixture: ComponentFixture<ListRequestjoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListRequestjoinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListRequestjoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
