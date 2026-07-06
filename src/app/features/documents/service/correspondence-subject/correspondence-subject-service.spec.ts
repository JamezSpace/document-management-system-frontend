import { TestBed } from '@angular/core/testing';

import { CorrespondenceSubjectService } from './correspondence-subject-service';

describe('CorrespondenceSubjectService', () => {
  let service: CorrespondenceSubjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorrespondenceSubjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
