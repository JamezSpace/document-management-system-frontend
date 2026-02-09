import { Component } from '@angular/core';
import { hlmH2 } from '@spartan-ng/helm/typography';

@Component({
  selector: 'nexus-spartan-h2',
  imports: [],
  templateUrl: './spartan-h2.html',
  styleUrl: './spartan-h2.css',
})
export class SpartanH2 {
h2_style = hlmH2.concat(' capitalize');
}
