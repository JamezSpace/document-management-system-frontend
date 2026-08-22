import { inject, Injectable } from '@angular/core';
import { ApiClient } from '../client/api-client';
import type {
  DocumentDto,
  DocumentSearchResultDto,
  SaveDocumentContentCommand,
} from './documents.contracts';

@Injectable({ providedIn: 'root' })
export class DocumentsApi {
  private readonly api = inject(ApiClient);

  saveContent(documentId: string, revision: number, command: SaveDocumentContentCommand) {
    return this.api.patch<DocumentDto>(`document/${documentId}/content`, command, undefined, {
      'If-Match': `"${revision}"`,
    });
  }

  submit(documentId: string, revision: number) {
    return this.api.postResponse<DocumentDto>(`document/${documentId}/submit`, {}, {
      headers: { 'If-Match': `"${revision}"` },
    });
  }

  search(query: string, limit = 25, cursor?: string) {
    return this.api.get<DocumentSearchResultDto>('document', undefined, {
      query,
      limit,
      ...(cursor ? { cursor } : {}),
    });
  }
}
