import { TestBed } from '@angular/core/testing';

import { OrgUnitsService } from './org-units-service';

describe('OrgUnitsService', () => {
  let service: OrgUnitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrgUnitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
