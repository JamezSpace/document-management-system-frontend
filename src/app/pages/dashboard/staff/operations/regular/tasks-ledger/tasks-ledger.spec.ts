import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksLedger } from './tasks-ledger';

describe('TasksLedger', () => {
  let component: TasksLedger;
  let fixture: ComponentFixture<TasksLedger>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksLedger]
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
