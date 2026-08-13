import type { OfficeWorkbenchKey } from './office-workbench';

export interface OfficeNavigationItem {
  label: string;
  icon: string;
  route: string;
  capability?: string;
  anyCapabilities?: string[];
}

export interface OfficeNavigationGroup {
  label: string;
  items: OfficeNavigationItem[];
}

export interface OfficeWorkbenchDefinition {
  key: OfficeWorkbenchKey;
  label: string;
  summary: string;
  landingRoute: string;
  accessCapabilities: string[];
  navigation: OfficeNavigationGroup[];
}
