export const OFFICE_WORKBENCH_KEYS = [
  'records',
  'secretariat',
  'processing',
  'leadership',
  'human-resources',
  'system-administration',
  'audit-compliance',
] as const;

export type OfficeWorkbenchKey = (typeof OFFICE_WORKBENCH_KEYS)[number];

export function isOfficeWorkbenchKey(value: unknown): value is OfficeWorkbenchKey {
  return typeof value === 'string' && OFFICE_WORKBENCH_KEYS.includes(value as OfficeWorkbenchKey);
}
