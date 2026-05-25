import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { SignaturePlaceHolderForBaseLevelAuthorityUi } from '../../../../interfaces/api/workspace/signature/signature.ui';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  private http = inject(HttpClient);

  // signaturePlaceholder !: WritableSignal<SignaturePlaceHolderForBaseLevelAuthorityUi>
  signaturePlaceholder = signal<SignaturePlaceHolderForBaseLevelAuthorityUi>({
    id: 'akhskash',
    format: '{signature}',
  });

  async getSignaturePlaceholder() {
    const data = this.http.get(
      `${environment.api}/signature/placeholder`,
    ) as Observable<SignaturePlaceHolderForBaseLevelAuthorityUi>;

    const signalData = toSignal(data);
    if (signalData()) this.signaturePlaceholder.set(signalData()!);
  }

  
}
