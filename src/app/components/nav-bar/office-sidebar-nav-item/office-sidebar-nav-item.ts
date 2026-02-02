import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { NavBarItem } from '../../../interfaces/nav-bar/NavBarItem.interface';

@Component({
  selector: 'nexus-office-sidebar-nav-item',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './office-sidebar-nav-item.html',
  styleUrl: './office-sidebar-nav-item.css',
})
export class OfficeSidebarNavItem {
    @Input({required: true})
    navItem !: NavBarItem
}
