import { TestBed } from '@angular/core/testing';

import { WorkspaceUiService } from './workspace-ui-service';

describe('WorkspaceUiService', () => {
  let service: WorkspaceUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkspaceUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
