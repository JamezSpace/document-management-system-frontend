import { TestBed } from '@angular/core/testing';

import { SideModalService } from './side-modal-service';

describe('SideModalService', () => {
  let service: SideModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SideModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
