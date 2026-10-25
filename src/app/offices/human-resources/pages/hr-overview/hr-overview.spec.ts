import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HrOverview } from './hr-overview';

describe('HrOverview', () => {
  let fixture: ComponentFixture<HrOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HrOverview],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HrOverview);
    fixture.detectChanges();
  });

  it('renders the HR overview only', () => {
    expect(fixture.nativeElement.textContent).toContain('Human Resources');
    expect(fixture.nativeElement.textContent).toContain('HR actions requiring attention');
    expect(fixture.nativeElement.textContent).not.toContain('Restricted personnel information');
  });
});
