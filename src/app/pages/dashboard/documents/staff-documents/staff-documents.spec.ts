import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffDocuments } from './staff-documents';

describe('StaffDocuments', () => {
  let component: StaffDocuments;
  let fixture: ComponentFixture<StaffDocuments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffDocuments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffDocuments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
