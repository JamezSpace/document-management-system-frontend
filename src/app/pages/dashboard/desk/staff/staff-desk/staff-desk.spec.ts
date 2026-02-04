import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffDesk } from './staff-desk';

describe('StaffDesk', () => {
  let component: StaffDesk;
  let fixture: ComponentFixture<StaffDesk>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffDesk]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffDesk);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
