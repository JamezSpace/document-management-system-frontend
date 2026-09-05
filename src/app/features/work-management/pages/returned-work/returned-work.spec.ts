import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { WorkItemsApi } from '../../../../api/work-management/work-items.api';
import { OfficeContextService } from '../../../../office-platform/context/office-context.service';
import { WorkItemsService } from '../../services/work-items/work-items-service';

import { ReturnedWork } from './returned-work';

describe('ReturnedWork', () => {
  let component: ReturnedWork;
  let fixture: ComponentFixture<ReturnedWork>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnedWork],
      providers: [
        provideRouter([]),
        {
          provide: WorkItemsApi,
          useValue: {
            listReturned: () =>
              of({ data: { items: [], pageInfo: { nextCursor: null, hasNextPage: false } } }),
          },
        },
        {
          provide: OfficeContextService,
          useValue: { route: (...segments: string[]) => `/office/processing/${segments.join('/')}` },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReturnedWork);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(TestBed.inject(WorkItemsService).returnedItems()).toEqual([]);
  });
});
