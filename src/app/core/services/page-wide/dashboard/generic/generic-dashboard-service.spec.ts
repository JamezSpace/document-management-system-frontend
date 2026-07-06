import { TestBed } from '@angular/core/testing';

import { GenericDashboardService } from './generic-dashboard-service';

describe('GenericDashboardService', () => {
  let service: GenericDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenericDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
