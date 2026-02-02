import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { OfficeSidebarNavItem } from "../office-sidebar-nav-item/office-sidebar-nav-item";
import { NavBarItem } from '../../../interfaces/nav-bar/NavBarItem.interface';

@Component({
  selector: 'nexus-office-sidebar',
  imports: [RouterLink, OfficeSidebarNavItem],
  templateUrl: './office-sidebar.html',
  styleUrl: './office-sidebar.css',
})
export class OfficeSidebar {
    navItems: NavBarItem[] = [
        {
            icon: "icon-[mdi--desk]",
            label: 'my desk',
            route: 'desk'
        },
        {
            icon: "icon-[solar--documents-bold-duotone]",
            label: 'documents vault',
            route: 'vault'
        },
        {
            icon: "icon-[lucide--activity]",
            label: 'departmental feed',
            route: 'office/feed'
        },
        {
            icon: "icon-[mdi--desk]",
            label: 'institutional forms',
            route: 'office/forms'
        }
    ]
}
