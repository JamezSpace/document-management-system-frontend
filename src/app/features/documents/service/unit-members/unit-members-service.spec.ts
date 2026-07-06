import { TestBed } from '@angular/core/testing';

import { UnitMembersService } from './unit-members-service';

describe('UnitMembersService', () => {
  let service: UnitMembersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitMembersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
