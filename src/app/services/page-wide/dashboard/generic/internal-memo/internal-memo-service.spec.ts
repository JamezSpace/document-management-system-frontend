import { TestBed } from '@angular/core/testing';

import { InternalMemoService } from './internal-memo-service';

describe('InternalMemoService', () => {
  let service: InternalMemoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternalMemoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
