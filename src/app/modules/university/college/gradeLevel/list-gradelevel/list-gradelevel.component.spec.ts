import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGradelevelComponent } from './list-gradelevel.component';

describe('ListGradelevelComponent', () => {
  let component: ListGradelevelComponent;
  let fixture: ComponentFixture<ListGradelevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListGradelevelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListGradelevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
