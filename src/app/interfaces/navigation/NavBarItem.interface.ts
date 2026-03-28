import { Params } from '@angular/router';

type Capability = string;

interface SubMenu {
  label: string;
  route: Params;
  requiredCapability: Capability;
}

interface NavBarItem {
  icon: string;
  label: string;
  route: string;
  defaultOpen?: boolean;
  subMenuExists: boolean;
  subMenus?: SubMenu[];
  group: NavGroup;
  leadsToExternalService?: boolean;
  requiredCapability: Capability;

  // for submenu-level control
  requiredAnyCapabilities?: Capability[];
}

enum NavGroup {
  GENERAL = 'general',
  OPERATIONS = 'operations',
  ADMINISTRATION = 'administration',
}

export { type NavBarItem, type SubMenu, NavGroup };
