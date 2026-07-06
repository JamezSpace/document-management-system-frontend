import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpartanH2 } from './spartan-h2';

describe('SpartanH2', () => {
  let component: SpartanH2;
  let fixture: ComponentFixture<SpartanH2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpartanH2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpartanH2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
