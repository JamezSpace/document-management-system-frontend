import { TestBed } from '@angular/core/testing';

import { BusinessFunctionService } from './business-function-service';

describe('BusinessFunctionService', () => {
  let service: BusinessFunctionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessFunctionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
