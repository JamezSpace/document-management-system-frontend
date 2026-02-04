import { Params } from "@angular/router";

interface SubMenu {
  label: string;
  route: Params;
}

interface NavBarItem {
  icon: string;
  label: string;
  route: string;
  defaultOpen?: boolean;
  subMenuExists: boolean;
  subMenus?: SubMenu[];
}

export type { NavBarItem };
