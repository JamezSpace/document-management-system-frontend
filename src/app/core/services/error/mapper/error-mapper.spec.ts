import { TestBed } from '@angular/core/testing';
import { ErrorMapperService } from './error-mapper';

describe('ErrorMapperService', () => {
  let service: ErrorMapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorMapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
