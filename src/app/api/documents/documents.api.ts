import { inject, Injectable } from '@angular/core';
import { ApiClient } from '../client/api-client';
import type { DocumentDto, SaveDocumentContentCommand } from './documents.contracts';

@Injectable({ providedIn: 'root' })
export class DocumentsApi {
  private readonly api = inject(ApiClient);

  saveContent(documentId: string, command: SaveDocumentContentCommand) {
    return this.api.patch<DocumentDto>(`document/${documentId}/content`, command);
  }

  submit(documentId: string) {
    return this.api.post<DocumentDto>(`document/${documentId}/submit`);
  }
}
