import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DecisionAuditTrail } from './decision-audit-trail';

describe('DecisionAuditTrail', () => {
  let fixture: ComponentFixture<DecisionAuditTrail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DecisionAuditTrail] }).compileComponents();
    fixture = TestBed.createComponent(DecisionAuditTrail);
    fixture.detectChanges();
  });

  it('renders an immutable decision ledger', () => {
    expect(fixture.nativeElement.textContent).toContain('intentionally provides no edit or delete controls');
  });
});
