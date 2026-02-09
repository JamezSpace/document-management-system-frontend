import { Component } from '@angular/core';
import { hlmMuted } from '@spartan-ng/helm/typography';

@Component({
  selector: 'nexus-spartan-muted',
  imports: [],
  templateUrl: './spartan-muted.html',
  styleUrl: './spartan-muted.css',
})
export class SpartanMuted {
muted_style = hlmMuted
}
