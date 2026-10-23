import type { OfficeWorkbenchKey } from './office-workbench';

interface OfficeNavigationItem {
  label: string;
  icon: string;
  route: string;
  capability?: string;
  anyCapabilities?: string[];
}

interface OfficeNavigationGroup {
  label: string;
  items: OfficeNavigationItem[];
}

interface OfficeWorkbenchDefinition {
  key: OfficeWorkbenchKey;
  label: string;
  summary: string;
  landingRoute: string;
  accessCapabilities: string[];
  navigation: OfficeNavigationGroup[];
}

export type {
  OfficeNavigationGroup,
  OfficeNavigationItem,
  OfficeWorkbenchDefinition,
};
