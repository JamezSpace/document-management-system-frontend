import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../../../environments/environment.development';
import { ApiResponse } from '../../../../../interfaces/shared/ApiResponse.interface';
import { HttpClient } from '@angular/common/http';
import { DocumentApi, InitDocumentApi } from '../../../../../interfaces/documents/Document.api';
import {
  CorrespondenceAddressee,
  DocumentType,
  LifecycleActions,
} from '../../../../../interfaces/documents/Document.enum';
import { GenericDashboardService } from '../generic-dashboard-service';

@Injectable({
  providedIn: 'root',
})
export class InternalMemoService {
  private http = inject(HttpClient);
  private dashboardService = inject(GenericDashboardService);

  data = signal<any>(null);
  error = signal<any>(null);

  initInternalMemo(newDocument: InitDocumentApi) {
    this.http
      .post<ApiResponse<InitDocumentApi>>(`${environment.api}/document`, {
        action: LifecycleActions.CREATE,
        addressedTo: CorrespondenceAddressee.UNIT,
        documentType: DocumentType.MEMO,
        ...newDocument,
      })
      .subscribe({
        next: (resp) => this.data.set(resp.data),
        error: (err) => this.error.set(err),
        complete: () => this.dashboardService.loading.set(false)
      });
  }
}
