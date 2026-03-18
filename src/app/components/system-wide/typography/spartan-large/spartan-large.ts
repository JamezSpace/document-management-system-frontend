import { Component } from '@angular/core';
import { hlmLarge } from '@spartan-ng/helm/typography';

@Component({
  selector: 'nexus-spartan-large',
  imports: [],
  templateUrl: './spartan-large.html',
  styleUrl: './spartan-large.css',
})
export class SpartanLarge {
    large_style = hlmLarge;
}
