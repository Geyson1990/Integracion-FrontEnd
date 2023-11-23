import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportRiskProjectComponent } from './report-risk-project.component';

describe('ReportRiskProjectComponent', () => {
  let component: ReportRiskProjectComponent;
  let fixture: ComponentFixture<ReportRiskProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportRiskProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportRiskProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
