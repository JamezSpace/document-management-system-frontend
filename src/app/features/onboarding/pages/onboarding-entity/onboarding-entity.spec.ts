import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingEntity } from './onboarding-entity';

describe('OnboardingEntity', () => {
  let component: OnboardingEntity;
  let fixture: ComponentFixture<OnboardingEntity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardingEntity]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingEntity);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
