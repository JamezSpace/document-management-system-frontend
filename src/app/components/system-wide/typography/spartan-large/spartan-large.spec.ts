import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpartanLarge } from './spartan-large';

describe('SpartanLarge', () => {
  let component: SpartanLarge;
  let fixture: ComponentFixture<SpartanLarge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpartanLarge]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpartanLarge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
