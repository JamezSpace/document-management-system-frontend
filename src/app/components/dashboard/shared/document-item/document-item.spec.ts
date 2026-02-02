import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentItem } from './document-item';

describe('DocumentItem', () => {
  let component: DocumentItem;
  let fixture: ComponentFixture<DocumentItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
