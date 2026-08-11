import { TestBed } from '@angular/core/testing';

import { CurrentStaffService } from './current-staff-service';

describe('CurrentStaffService', () => {
  let service: CurrentStaffService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentStaffService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
