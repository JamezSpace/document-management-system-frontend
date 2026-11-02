import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StaffAdministrationApi } from './staff-administration.api';

describe('StaffAdministrationApi', () => {
  let api: StaffAdministrationApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    api = TestBed.inject(StaffAdministrationApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('sends server-side staff filters and pagination', () => {
    api
      .listStaff({ page: 2, pageSize: 25, status: 'active', unitId: 'UNIT-1', search: 'samuel' })
      .subscribe();

    const request = http.expectOne((candidate) => candidate.url.endsWith('/identity/staff'));
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('pageSize')).toBe('25');
    expect(request.request.params.get('status')).toBe('active');
    expect(request.request.params.get('unitId')).toBe('UNIT-1');
    expect(request.request.params.get('search')).toBe('samuel');
    request.flush({ success: true, data: { items: [], total: 0, page: 2, pageSize: 25, totalPages: 0 } });
  });

  it('retains the staff ETag from detail and sends it on managed-field updates', () => {
    api.getStaff('STAFF-1').subscribe((response) => {
      expect(response.headers.get('ETag')).toBe('"staff-3"');
    });
    const detail = http.expectOne((candidate) => candidate.url.endsWith('/identity/staff/STAFF-1'));
    detail.flush({ success: true, data: {} }, { headers: { ETag: '"staff-3"' } });

    api
      .updateStaff('STAFF-1', '"staff-3"', {
        changes: { staffNumber: 231434, unitId: 'UNIT-2' },
        reason: 'Approved organizational reassignment',
      })
      .subscribe();
    const update = http.expectOne((candidate) => candidate.url.endsWith('/identity/staff/STAFF-1'));
    expect(update.request.method).toBe('PATCH');
    expect(update.request.headers.get('If-Match')).toBe('"staff-3"');
    expect(update.request.body.changes.unitId).toBe('UNIT-2');
    update.flush({ success: true, data: {} });
  });

  it('uses an explicit revision-safe status transition instead of DELETE', () => {
    api
      .transitionStatus('STAFF-1', '"staff-3"', {
        toStatus: 'suspended',
        reason: 'Pending formal investigation',
      })
      .subscribe();

    const request = http.expectOne((candidate) =>
      candidate.url.endsWith('/identity/staff/STAFF-1/status-transitions'),
    );
    expect(request.request.method).toBe('POST');
    expect(request.request.headers.get('If-Match')).toBe('"staff-3"');
    request.flush({ success: true, data: {} });
  });

  it('lists and decides identity changes through the review endpoints', () => {
    api.listIdentityChangeRequests({ page: 1, pageSize: 25, status: 'pending' }).subscribe();
    const list = http.expectOne((candidate) =>
      candidate.url.endsWith('/identity/identity-change-requests'),
    );
    expect(list.request.params.get('status')).toBe('pending');
    list.flush({ success: true, data: { items: [], total: 0, page: 1, pageSize: 25, totalPages: 0 } });

    api
      .decideIdentityChange('ICR-1', {
        decision: 'approve',
        reason: 'Supporting evidence verified',
      })
      .subscribe();
    const decision = http.expectOne((candidate) =>
      candidate.url.endsWith('/identity/identity-change-requests/ICR-1/decision'),
    );
    expect(decision.request.method).toBe('POST');
    expect(decision.request.body.decision).toBe('approve');
    decision.flush({ success: true, data: {} });
  });
});
