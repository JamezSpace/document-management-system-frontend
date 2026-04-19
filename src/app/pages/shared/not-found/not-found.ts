import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SpartanH1 } from "../../../components/system-wide/typography/spartan-h1/spartan-h1";
import { SpartanH2 } from "../../../components/system-wide/typography/spartan-h2/spartan-h2";
import { SpartanP } from "../../../components/system-wide/typography/spartan-p/spartan-p";
import { SpartanH3 } from "../../../components/system-wide/typography/spartan-h3/spartan-h3";
import { SpartanMuted } from "../../../components/system-wide/typography/spartan-muted/spartan-muted";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideCompass, lucideSearchX } from '@ng-icons/lucide';

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
