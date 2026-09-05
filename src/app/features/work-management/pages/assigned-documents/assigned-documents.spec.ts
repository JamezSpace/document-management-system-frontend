import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { WorkItemsApi } from '../../../../api/work-management/work-items.api';
import { OfficeContextService } from '../../../../office-platform/context/office-context.service';
import { WorkItemsService } from '../../services/work-items/work-items-service';

import { AssignedDocuments } from './assigned-documents';

describe('AssignedDocuments', () => {
  let component: AssignedDocuments;
  let fixture: ComponentFixture<AssignedDocuments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignedDocuments],
      providers: [
        provideRouter([]),
        {
          provide: WorkItemsApi,
          useValue: {
            listAssigned: () =>
              of({ data: { items: [], pageInfo: { nextCursor: null, hasNextPage: false } } }),
          },
        },
        {
          provide: OfficeContextService,
          useValue: { route: (...segments: string[]) => `/office/processing/${segments.join('/')}` },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedDocuments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the assignment register and work actions', () => {
    const text = fixture.nativeElement.textContent.replace(/\s+/g, ' ');
    expect(text).toContain('Assigned documents');
    expect(text).toContain('Assigning authority');
    expect(TestBed.inject(WorkItemsService).assignedItems()).toEqual([]);
  });
});
