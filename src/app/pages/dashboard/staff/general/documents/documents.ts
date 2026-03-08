import { Component } from '@angular/core';
import { DocumentRegistry } from '../../../../../components/dashboard-wide/shared/document-registry/document-registry';

@Component({
  selector: 'nexus-documents',
  imports: [DocumentRegistry],
  templateUrl: './documents.html',
  styleUrl: './documents.css',
})
export class Documents {

}
