import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfficeContextService } from '../../../office-platform/context/office-context.service';

import { DocumentRegistry } from './document-registry';

describe('DocumentRegistry', () => {
  let component: DocumentRegistry;
  let fixture: ComponentFixture<DocumentRegistry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentRegistry],
      providers: [
        {
          provide: OfficeContextService,
          useValue: { route: (...segments: string[]) => `/office/processing/${segments.join('/')}` },
        },
      ],
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
