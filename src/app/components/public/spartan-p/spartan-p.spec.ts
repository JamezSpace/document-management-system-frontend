import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpartanP } from './spartan-p';

describe('SpartanP', () => {
  let component: SpartanP;
  let fixture: ComponentFixture<SpartanP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpartanP]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpartanP);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
