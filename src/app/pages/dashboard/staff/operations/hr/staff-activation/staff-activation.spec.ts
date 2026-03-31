import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffActivation } from './staff-activation';

describe('StaffActivation', () => {
  let component: StaffActivation;
  let fixture: ComponentFixture<StaffActivation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffActivation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffActivation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
