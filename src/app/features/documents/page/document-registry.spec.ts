import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentRegistry } from './document-registry';

describe('DocumentRegistry', () => {
  let component: DocumentRegistry;
  let fixture: ComponentFixture<DocumentRegistry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentRegistry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentRegistry);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
