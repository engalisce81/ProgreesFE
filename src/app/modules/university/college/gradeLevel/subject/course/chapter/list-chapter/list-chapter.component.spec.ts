import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListChapterComponent } from './list-chapter.component';

describe('ListChapterComponent', () => {
  let component: ListChapterComponent;
  let fixture: ComponentFixture<ListChapterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListChapterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListChapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
