import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';


@Component({
  selector: 'nexus-unauthorized',
  templateUrl: './unauthorized.html',
  styleUrl: './unauthorized.css',
})
export class Unauthorized {
  location = inject(Location);

  goBack(): void {
    this.location.back();
  }
}
