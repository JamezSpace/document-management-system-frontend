import type { WorkspaceActions } from '../../enums/workspace/actions.enum';
import type { DocumentDto } from '../documents/documents.contracts';

interface WorkspaceWorkflowDto {
  canAdvance: boolean;
  canReject: boolean;
  completed: boolean;
  rejected: boolean;
}

type ExtractionDeliveryMode = 'direct' | 'server_rendered_only';

interface WorkspaceExtractionDirectiveDto {
  allowed: boolean;
  reasonCode: string;
  obligations: string[];
  deliveryMode: ExtractionDeliveryMode;
}

interface WorkspaceGovernanceDto {
  policyId: string;
  policyVersion: number;
  extraction: {
    export: WorkspaceExtractionDirectiveDto;
    print: WorkspaceExtractionDirectiveDto;
  };
}

interface WorkspaceCanvasDto {
  visible: boolean;
  placement: 'internal_routing' | 'letterhead_footer' | null;
  reasonCode: string;
}

interface WorkspaceDto {
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

export type { WorkspaceWorkflowDto, ExtractionDeliveryMode, WorkspaceExtractionDirectiveDto, WorkspaceGovernanceDto, WorkspaceCanvasDto, WorkspaceDto };
