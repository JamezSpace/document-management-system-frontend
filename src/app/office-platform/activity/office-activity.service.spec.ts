import { OfficeActivityService } from './office-activity.service';

describe('OfficeActivityService', () => {
  it('stays active until every concurrent request finishes', () => {
    const service = new OfficeActivityService();
    const finishDocuments = service.begin();
    const finishNotices = service.begin();

    expect(service.activeRequestCount()).toBe(2);
    expect(service.isLoading()).toBe(true);

    finishDocuments();
    expect(service.activeRequestCount()).toBe(1);
    expect(service.isLoading()).toBe(true);

    finishNotices();
    expect(service.activeRequestCount()).toBe(0);
    expect(service.isLoading()).toBe(false);
  });

  it('does not decrement twice when a completion callback is repeated', () => {
    const service = new OfficeActivityService();
    const finish = service.begin();

    finish();
    finish();

    expect(service.activeRequestCount()).toBe(0);
  });
});
