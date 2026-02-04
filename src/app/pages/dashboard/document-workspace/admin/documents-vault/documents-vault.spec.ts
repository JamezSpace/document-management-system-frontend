import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsVault } from './documents-vault';

describe('DocumentsVault', () => {
  let component: DocumentsVault;
  let fixture: ComponentFixture<DocumentsVault>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentsVault]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentsVault);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
