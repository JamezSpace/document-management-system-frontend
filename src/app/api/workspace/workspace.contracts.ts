import type { WorkspaceActions } from '../../enums/workspace/actions.enum';
import type { DocumentDto } from '../documents/documents.contracts';

export interface WorkspaceWorkflowDto {
  canAdvance: boolean;
  canReject: boolean;
  completed: boolean;
  rejected: boolean;
}

export interface WorkspaceDto {
  mode: 'edit' | 'readonly';
  authorizedActions: WorkspaceActions[];
  workflow: WorkspaceWorkflowDto;
  metadata: {
    isAuthor: boolean;
    document: DocumentDto;
  };
}
