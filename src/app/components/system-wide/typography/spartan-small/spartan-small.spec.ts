import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpartanSmall } from './spartan-small';

describe('SpartanSmall', () => {
  let component: SpartanSmall;
  let fixture: ComponentFixture<SpartanSmall>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpartanSmall]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpartanSmall);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
