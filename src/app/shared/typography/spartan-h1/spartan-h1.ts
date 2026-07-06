import { Component } from '@angular/core';
import { hlmH1 } from '@spartan-ng/helm/typography';

@Component({
  selector: 'nexus-spartan-h1',
  imports: [],
  templateUrl: './spartan-h1.html',
  styleUrl: './spartan-h1.css',
})
export class SpartanH1 {
h1_style = hlmH1.concat(' capitalize');
}
