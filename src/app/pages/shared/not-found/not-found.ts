import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideCompass, lucideSearchX } from '@ng-icons/lucide';
import { SpartanH3 } from '../../../shared/typography/spartan-h3/spartan-h3';
import { SpartanMuted } from '../../../shared/typography/spartan-muted/spartan-muted';

@Component({
  selector: 'nexus-not-found',
  imports: [RouterLink, SpartanH3, SpartanMuted, NgIcon],
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
