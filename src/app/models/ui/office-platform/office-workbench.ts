const OFFICE_WORKBENCH_KEYS = [
  'records',
  'secretariat',
  'processing',
  'leadership',
  'human-resources',
  'system-administration',
  'audit-compliance',
] as const;

type OfficeWorkbenchKey = (typeof OFFICE_WORKBENCH_KEYS)[number];

function isOfficeWorkbenchKey(value: unknown): value is OfficeWorkbenchKey {
  return typeof value === 'string' && OFFICE_WORKBENCH_KEYS.includes(value as OfficeWorkbenchKey);
}

export { isOfficeWorkbenchKey, OFFICE_WORKBENCH_KEYS };
export type { OfficeWorkbenchKey };
