import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpartanH3 } from './spartan-h3';

describe('SpartanH3', () => {
  let component: SpartanH3;
  let fixture: ComponentFixture<SpartanH3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpartanH3]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpartanH3);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
