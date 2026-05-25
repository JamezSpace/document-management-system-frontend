import { Component, inject, input } from '@angular/core';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { CorrespondenceToBeRendered } from '../../../../interfaces/api/workspace/correspondence/correspondence.api';
import { OrgUnitsService } from '../../../../services/page-wide/dashboard/documents-registry/org-units/org-units-service';
import { SpartanP } from '../../../system-wide/typography/spartan-p/spartan-p';

@Component({
  selector: 'nexus-memo-template',
  imports: [HlmSeparator, SpartanP],
  templateUrl: './memo-template.html',
  styleUrl: './memo-template.css',
})
export class MemoTemplate {
  unitService = inject(OrgUnitsService); 

//   ngOnInit() {
//     if(!this.unitService.units()) 
//         this.unitService.fetchOrgUnits();
//   }

//   private initEffect = effect(() => {
//     const units = this.unitService.units();


//   })


  correspondence = input.required<CorrespondenceToBeRendered>();
  
  formattedDate(date: string | Date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
