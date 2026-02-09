import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpartanMuted } from './spartan-muted';

describe('SpartanMuted', () => {
  let component: SpartanMuted;
  let fixture: ComponentFixture<SpartanMuted>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpartanMuted]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpartanMuted);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
