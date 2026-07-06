import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpartanH4 } from './spartan-h4';

describe('SpartanH4', () => {
  let component: SpartanH4;
  let fixture: ComponentFixture<SpartanH4>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpartanH4]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpartanH4);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
