import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SpartanH1 } from '../../../../components/system-wide/typography/spartan-h1/spartan-h1';
import { SpartanP } from "../../../../components/system-wide/typography/spartan-p/spartan-p";

@Component({
  selector: 'nexus-unauthorized',
  imports: [SpartanH1, SpartanP],
  templateUrl: './unauthorized.html',
  styleUrl: './unauthorized.css',
})
export class Unauthorized {
  location = inject(Location);

  goBack(): void {
    this.location.back();
  }
}
