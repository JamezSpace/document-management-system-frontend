import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideCompass, lucideSearchX } from '@ng-icons/lucide';

@Component({
  selector: 'nexus-not-found',
  imports: [RouterLink, NgIcon],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
  providers: [
      provideIcons({
        lucideSearchX,
        lucideCompass
      }),
    ],
})
export class NotFound {
  location = inject(Location);

  goBack(): void {
    this.location.back();
  }
}
