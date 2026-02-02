import { Component } from '@angular/core';
import { OfficeSidebar } from "../../../../components/nav-bar/office-sidebar/office-sidebar";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'nexus-dashboard-office-template',
  imports: [OfficeSidebar, RouterOutlet],
  templateUrl: './dashboard-office-template.html',
  styleUrl: './dashboard-office-template.css',
})
export class DashboardOfficeTemplate {

}
