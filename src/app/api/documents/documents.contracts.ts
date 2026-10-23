import type { DocumentApi } from '../../models/api/documents/Document.api';

type DocumentDto = DocumentApi;

interface DocumentSearchItemDto {
  id: string;
  title: string;
  referenceNumber: string | null;
  sensitivity: 'public' | 'internal' | 'confidential' | 'restricted';
  createdAt: string;
  revision: number;
}

interface CursorPageInfoDto {
  limit: number;
  hasMore: boolean;
  nextCursor: string | null;
}

interface DocumentSearchResultDto {
  items: DocumentSearchItemDto[];
  pageInfo: CursorPageInfoDto;
}

interface SaveDocumentContentCommand {
  contentDelta: unknown;
}

export type { DocumentDto, DocumentSearchItemDto, CursorPageInfoDto, DocumentSearchResultDto, SaveDocumentContentCommand };
