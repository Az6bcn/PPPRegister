import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckedinReportComponent } from './checkedin-report.component';

describe('CheckedinReportComponent', () => {
  let component: CheckedinReportComponent;
  let fixture: ComponentFixture<CheckedinReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckedinReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckedinReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
