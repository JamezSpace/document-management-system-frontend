import { Component } from '@angular/core';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { SpartanP } from '../../../system-wide/typography/spartan-p/spartan-p';

@Component({
  selector: 'nexus-external-memo-template',
  imports: [HlmSeparator, SpartanP],
  templateUrl: './external-memo-template.html',
  styleUrl: './external-memo-template.css',
})
export class ExternalMemoTemplate {
  memoDetails: { fromDept: string; from: string; to: string; refNo: string; date: string; title: string; } = {
    fromDept: 'industrial training coordinating centre',
    from: 'Deputy Registrar',
    to: 'ITEMS-MIS',
    refNo: '2026/ITCC/ITEMS-MIS/PERS/0050',
    date: '01/12/26',
    title: 'issues with hunger'
  };
}
