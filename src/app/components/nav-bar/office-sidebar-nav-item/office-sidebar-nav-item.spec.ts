import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeSidebarNavItem } from './office-sidebar-nav-item';

describe('OfficeSidebarNavItem', () => {
  let component: OfficeSidebarNavItem;
  let fixture: ComponentFixture<OfficeSidebarNavItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficeSidebarNavItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficeSidebarNavItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
