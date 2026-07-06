import { Component } from '@angular/core';
import { hlmH3 } from '@spartan-ng/helm/typography';

@Component({
  selector: 'nexus-spartan-h3',
  imports: [],
  templateUrl: './spartan-h3.html',
  styleUrl: './spartan-h3.css',
})
export class SpartanH3 {
  h3_style = hlmH3.concat(' capitalize');
}
