import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmMenubarImports } from '@spartan-ng/helm/menubar';
import { HlmSeparator } from "@spartan-ng/helm/separator";
import { SpartanH3 } from "../../../../../components/system-wide/typography/spartan-h3/spartan-h3";
import { SpartanP } from "../../../../../components/system-wide/typography/spartan-p/spartan-p";
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';


@Component({
  selector: 'nexus-notices',
  imports: [SpartanH3, SpartanP, HlmSeparator,HlmMenubarImports, HlmDropdownMenuImports,
    HlmInputGroupImports, NgIcon],
  templateUrl: './notices.html',
  styleUrl: './notices.css',
  providers: [
    provideIcons({
        
    })
  ]
})
export class Notices {

}
