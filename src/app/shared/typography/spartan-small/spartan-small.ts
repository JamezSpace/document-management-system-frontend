import { Component } from '@angular/core';
import { hlmSmall } from '@spartan-ng/helm/typography';

@Component({
  selector: 'nexus-spartan-small',
  imports: [],
  templateUrl: './spartan-small.html',
  styleUrl: './spartan-small.css',
})
export class SpartanSmall {
    small_style = hlmSmall
}
