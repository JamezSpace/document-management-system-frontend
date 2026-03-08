import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectivesLog } from './directives-log';

describe('DirectivesLog', () => {
  let component: DirectivesLog;
  let fixture: ComponentFixture<DirectivesLog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectivesLog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectivesLog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
