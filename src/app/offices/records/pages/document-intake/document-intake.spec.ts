import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DocumentIntake } from './document-intake';

describe('DocumentIntake', () => {
  let component: DocumentIntake;
  let fixture: ComponentFixture<DocumentIntake>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DocumentIntake], providers: [provideRouter([])] }).compileComponents();
    fixture = TestBed.createComponent(DocumentIntake);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('keeps the intake step within the governed workflow', () => {
    component.setIntakeStep(99);
    expect(component.intakeStep()).toBe(4);
    component.setIntakeStep(-1);
    expect(component.intakeStep()).toBe(0);
  });
});
