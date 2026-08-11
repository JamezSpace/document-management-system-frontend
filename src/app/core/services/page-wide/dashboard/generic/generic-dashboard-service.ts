import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { BussFunctionApi } from '../../../../../models/api/documents/bussFunction/bussFunction.api';
import { CorrSubjectApi } from '../../../../../models/api/documents/corrSubject/corrSubject.api';
import { DocTypeApi } from '../../../../../models/api/documents/docType/docType.api';


@Injectable({
  providedIn: 'root',
})
// this service serves things common to the document initiator (e.g. StaffDocuments.html), workspace and editor in the workspace
export class GenericDashboardService {
  private http = inject(HttpClient);
  loading = signal<boolean>(false);

  correspondencSubjects = signal<CorrSubjectApi[]>([]);
  businessFunctions = signal<BussFunctionApi[]>([])
  documentTypes = signal<DocTypeApi[]>([])

}
