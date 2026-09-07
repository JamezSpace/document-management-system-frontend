import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Escalations } from './escalations';

describe('Escalations', () => {
  let fixture: ComponentFixture<Escalations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Escalations] }).compileComponents();
    fixture = TestBed.createComponent(Escalations);
    fixture.detectChanges();
  });

  it('groups cases by the required form of authority', () => {
    expect(fixture.nativeElement.textContent).toContain('Authority required');
    expect(fixture.nativeElement.textContent).toContain('Industrial attachment policy implementation');
  });
});
