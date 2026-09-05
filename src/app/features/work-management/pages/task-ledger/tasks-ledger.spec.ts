import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TasksLedger } from './tasks-ledger';

describe('TasksLedger', () => {
  let component: TasksLedger;
  let fixture: ComponentFixture<TasksLedger>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksLedger],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksLedger);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
