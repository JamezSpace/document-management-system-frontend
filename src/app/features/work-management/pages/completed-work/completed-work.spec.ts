import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CompletedWork } from './completed-work';

describe('CompletedWork', () => {
  let component: CompletedWork;
  let fixture: ComponentFixture<CompletedWork>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletedWork],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CompletedWork);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
