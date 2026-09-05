import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ReviewsMinutes } from './reviews-minutes';

describe('ReviewsMinutes', () => {
  let component: ReviewsMinutes;
  let fixture: ComponentFixture<ReviewsMinutes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewsMinutes],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewsMinutes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders requested decisions and reviewer-mode actions', () => {
    const text = fixture.nativeElement.textContent.replace(/\s+/g, ' ');
    expect(text).toContain('Reviews & minutes');
    expect(text).toContain('Requested decision');
    expect(text).toContain('previous minutes');
    expect(text).toContain('Review in workspace');
  });
});
