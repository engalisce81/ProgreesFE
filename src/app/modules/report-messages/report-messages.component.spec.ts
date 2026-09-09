import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportMessagesComponent } from './report-messages.component';

describe('ReportMessagesComponent', () => {
  let component: ReportMessagesComponent;
  let fixture: ComponentFixture<ReportMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportMessagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
