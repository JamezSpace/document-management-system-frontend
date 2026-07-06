import { Component } from '@angular/core';
import { hlmP } from '@spartan-ng/helm/typography';

@Component({
  selector: 'nexus-spartan-p',
  imports: [],
  templateUrl: './spartan-p.html',
  styleUrl: './spartan-p.css',
})
export class SpartanP {
  p_style = hlmP;
}
