import { Component, inject, input, WritableSignal } from '@angular/core';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { SpartanP } from '../../../system-wide/typography/spartan-p/spartan-p';
import { DocumentsService } from '../../../../services/page-wide/dashboard/generic/documents/documents-service';
import { DocumentApi } from '../../../../interfaces/documents/Document.api';

@Component({
  selector: 'nexus-memo-template',
  imports: [HlmSeparator, SpartanP],
  templateUrl: './memo-template.html',
  styleUrl: './memo-template.css',
})
export class MemoTemplate {
  memoDetails: { fromDept: string; from: string; to: string; refNo: string; date: string; title: string; } = {
    fromDept: 'industrial training coordinating centre',
    from: 'Deputy Registrar',
    to: 'ITEMS-MIS',
    refNo: '2026/ITCC/ITEMS-MIS/PERS/0050',
    date: '01/12/26',
    title: 'issues with hunger'
  };

  documentToRender = input.required<DocumentApi>()
  formattedDate(date: string | Date) {
    return new Date(date).toLocaleDateString();
  }
}
