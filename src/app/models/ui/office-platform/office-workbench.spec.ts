import { isOfficeWorkbenchKey, OFFICE_WORKBENCH_KEYS } from './office-workbench';

describe('office workbench contract', () => {
  it('recognises every supported workbench', () => {
    for (const key of OFFICE_WORKBENCH_KEYS) expect(isOfficeWorkbenchKey(key)).toBeTrue();
  });

  it('rejects display names and legacy folder labels', () => {
    expect(isOfficeWorkbenchKey('CIO')).toBeFalse();
    expect(isOfficeWorkbenchKey('hr')).toBeFalse();
    expect(isOfficeWorkbenchKey('regular')).toBeFalse();
  });
});
