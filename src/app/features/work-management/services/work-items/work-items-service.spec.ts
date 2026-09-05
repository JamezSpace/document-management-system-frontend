import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { WorkItemsApi } from '../../../../api/work-management/work-items.api';
import { WorkItemsService } from './work-items-service';

describe('WorkItemsService', () => {
  it('should be created', () => {
    TestBed.configureTestingModule({
      providers: [
        WorkItemsService,
        {
          provide: WorkItemsApi,
          useValue: {
            listAssigned: () => of({ data: { items: [], pageInfo: null } }),
            listReturned: () => of({ data: { items: [], pageInfo: null } }),
            listCompleted: () => of({ data: { items: [], pageInfo: null } }),
            getDetail: () => of({ data: null }),
          },
        },
      ],
    });

    expect(TestBed.inject(WorkItemsService)).toBeTruthy();
  });
});
