import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingNavBar } from './onboarding-nav-bar';

describe('OnboardingNavBar', () => {
  let component: OnboardingNavBar;
  let fixture: ComponentFixture<OnboardingNavBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardingNavBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingNavBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
