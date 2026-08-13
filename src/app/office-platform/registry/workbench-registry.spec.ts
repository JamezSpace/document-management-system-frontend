import { TestBed } from '@angular/core/testing';
import { WorkbenchRegistry } from './workbench-registry';
import { OFFICE_WORKBENCH_KEYS } from '../models/office-workbench';

describe('WorkbenchRegistry', () => {
  let registry: WorkbenchRegistry;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    registry = TestBed.inject(WorkbenchRegistry);
  });

  it('defines every canonical office workbench', () => {
    expect(registry.all().map((definition) => definition.key)).toEqual([...OFFICE_WORKBENCH_KEYS]);
  });

  it('gives each workbench an owned landing route and navigation', () => {
    for (const definition of registry.all()) {
      expect(definition.landingRoute).toBe('overview');
      expect(definition.navigation.length).toBeGreaterThan(0);
      expect(definition.navigation.some((group) => group.items.length > 0)).toBeTrue();
    }
  });
});
