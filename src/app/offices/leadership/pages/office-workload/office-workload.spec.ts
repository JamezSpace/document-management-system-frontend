import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfficeWorkload } from './office-workload';

describe('OfficeWorkload', () => {
  let fixture: ComponentFixture<OfficeWorkload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OfficeWorkload] }).compileComponents();
    fixture = TestBed.createComponent(OfficeWorkload);
    fixture.detectChanges();
  });

  it('shows capacity context without productivity scoring', () => {
    expect(fixture.nativeElement.textContent).toContain('Capacity planning—not productivity scoring');
  });
});
