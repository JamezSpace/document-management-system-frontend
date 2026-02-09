import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpartanH1 } from './spartan-h1';

describe('SpartanH1', () => {
  let component: SpartanH1;
  let fixture: ComponentFixture<SpartanH1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpartanH1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpartanH1);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
