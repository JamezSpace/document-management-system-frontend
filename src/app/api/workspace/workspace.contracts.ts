import type { WorkspaceActions } from '../../enums/workspace/actions.enum';
import type { DocumentDto } from '../documents/documents.contracts';

export interface WorkspaceWorkflowDto {
  canAdvance: boolean;
  canReject: boolean;
  completed: boolean;
  rejected: boolean;
}

export type ExtractionDeliveryMode = 'direct' | 'server_rendered_only';

export interface WorkspaceExtractionDirectiveDto {
  allowed: boolean;
  reasonCode: string;
  obligations: string[];
  deliveryMode: ExtractionDeliveryMode;
}

export interface WorkspaceGovernanceDto {
  policyId: string;
  policyVersion: number;
  extraction: {
    export: WorkspaceExtractionDirectiveDto;
    print: WorkspaceExtractionDirectiveDto;
  };
}

export interface WorkspaceCanvasDto {
  visible: boolean;
  placement: 'internal_routing' | 'letterhead_footer' | null;
  reasonCode: string;
}

export interface WorkspaceDto {
  mode: 'edit' | 'readonly';
  authorizedActions: WorkspaceActions[];
  workflow: WorkspaceWorkflowDto | null;
  governance: WorkspaceGovernanceDto;
  metadata: {
    isAuthor: boolean;
    document: DocumentDto;
  };
  canvas: WorkspaceCanvasDto;
}
