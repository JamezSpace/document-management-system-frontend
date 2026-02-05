import { TestBed } from '@angular/core/testing';

import { DocumentsVault } from './documents-vault';

describe('DocumentsVault', () => {
  let service: DocumentsVault;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentsVault);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
