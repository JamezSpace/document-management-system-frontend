import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeSidebar } from './office-sidebar';

describe('OfficeSidebar', () => {
  let component: OfficeSidebar;
  let fixture: ComponentFixture<OfficeSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficeSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficeSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
