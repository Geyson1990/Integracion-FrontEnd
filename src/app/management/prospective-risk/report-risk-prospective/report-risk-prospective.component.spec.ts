import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportRiskProspectiveComponent } from './report-risk-prospective.component';

describe('ReportRiskProspectiveComponent', () => {
  let component: ReportRiskProspectiveComponent;
  let fixture: ComponentFixture<ReportRiskProspectiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportRiskProspectiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportRiskProspectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
