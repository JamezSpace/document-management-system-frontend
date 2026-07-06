import { TestBed } from '@angular/core/testing';

import { StaffDetails } from './staff-details-service';

describe('StaffDetails', () => {
  let service: StaffDetails;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaffDetails);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
