import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LeadershipOverview } from './leadership-overview';

describe('LeadershipOverview', () => {
  let fixture: ComponentFixture<LeadershipOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadershipOverview],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LeadershipOverview);
    fixture.detectChanges();
  });

  it('centres the overview on decisions requiring authority', () => {
    expect(fixture.nativeElement.textContent).toContain('Decisions requiring you');
  });
});
