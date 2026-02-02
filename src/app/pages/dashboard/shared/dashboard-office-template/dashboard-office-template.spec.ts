import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardOfficeTemplate } from './dashboard-office-template';

describe('DashboardOfficeTemplate', () => {
  let component: DashboardOfficeTemplate;
  let fixture: ComponentFixture<DashboardOfficeTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardOfficeTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardOfficeTemplate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
