import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ReturnedWork } from './returned-work';

describe('ReturnedWork', () => {
  let component: ReturnedWork;
  let fixture: ComponentFixture<ReturnedWork>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnedWork],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ReturnedWork);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
