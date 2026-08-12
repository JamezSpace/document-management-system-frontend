import type { DocumentApi } from '../../models/api/documents/Document.api';

export type DocumentDto = DocumentApi;

export interface SaveDocumentContentCommand {
  contentDelta: unknown;
}
