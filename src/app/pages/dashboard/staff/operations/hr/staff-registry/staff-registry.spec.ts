import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffRegistry } from './staff-registry';

describe('StaffRegistry', () => {
  let component: StaffRegistry;
  let fixture: ComponentFixture<StaffRegistry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffRegistry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffRegistry);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
