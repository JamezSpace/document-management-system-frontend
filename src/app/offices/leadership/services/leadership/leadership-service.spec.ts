import { TestBed } from '@angular/core/testing';
import { LeadershipService } from './leadership-service';

describe('LeadershipService', () => {
  let service: LeadershipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeadershipService);
  });

  it('prepares authority evidence for an exact signature decision', () => {
    service.selectDecision('lead-0194');
    service.prepareApproval();

    expect(service.authorityAction().proposedState).toContain('legally effective');
    expect(service.authorityAction().evidence).toContain('exact version');
  });
});
