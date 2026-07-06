import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineLoader } from './line-loader';

describe('LineLoader', () => {
  let component: LineLoader;
  let fixture: ComponentFixture<LineLoader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineLoader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineLoader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
