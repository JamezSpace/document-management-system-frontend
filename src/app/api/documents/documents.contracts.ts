import type { DocumentApi } from '../../models/api/documents/Document.api';

export type DocumentDto = DocumentApi;

export interface DocumentSearchItemDto {
  id: string;
  title: string;
  referenceNumber: string | null;
  sensitivity: 'public' | 'internal' | 'confidential' | 'restricted';
  createdAt: string;
  revision: number;
}

export interface CursorPageInfoDto {
  limit: number;
  hasMore: boolean;
  nextCursor: string | null;
}

export interface DocumentSearchResultDto {
  items: DocumentSearchItemDto[];
  pageInfo: CursorPageInfoDto;
}

export interface SaveDocumentContentCommand {
  contentDelta: unknown;
}
