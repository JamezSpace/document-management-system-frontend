import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffListView } from './staff-list-view';

describe('StaffListView', () => {
  let component: StaffListView;
  let fixture: ComponentFixture<StaffListView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffListView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffListView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
