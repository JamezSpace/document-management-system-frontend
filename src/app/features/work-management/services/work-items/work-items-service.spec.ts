import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { WorkItemsApi } from '../../../../api/work-management/work-items.api';
import { TRACK_OFFICE_ACTIVITY } from '../../../../office-platform/activity/office-activity.context';
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

  it('tracks assigned work requests as office activity', () => {
    const listAssigned = jasmine
      .createSpy('listAssigned')
      .and.returnValue(of({ data: { items: [], pageInfo: null } }));

    TestBed.configureTestingModule({
      providers: [
        WorkItemsService,
        {
          provide: WorkItemsApi,
          useValue: { listAssigned },
        },
      ],
    });

    TestBed.inject(WorkItemsService).loadAssigned();

    const context = listAssigned.calls.mostRecent().args[1];
    expect(context.get(TRACK_OFFICE_ACTIVITY)).toBeTrue();
  });
});
