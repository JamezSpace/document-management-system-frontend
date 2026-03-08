import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitControl } from './unit-control';

describe('UnitControl', () => {
  let component: UnitControl;
  let fixture: ComponentFixture<UnitControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitControl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitControl);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
