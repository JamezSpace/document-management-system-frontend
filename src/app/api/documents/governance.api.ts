import { HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SKIP_ERROR_PRESENTATION } from '../../core/interceptors/error/error-context';
import { ApiClient } from '../client/api-client';
import type {
  CreateGovernanceGrantCommand,
  CreateGovernanceGrantResult,
  GovernanceGrantDto,
  PendingSensitivityChangesDto,
  RequestSensitivityChangeCommand,
  RequestSensitivityChangeResult,
  RevokeGovernanceGrantResult,
  ReviewSensitivityChangeResult,
  SensitivityChangeDto,
  SensitivityDecision,
} from './governance.contracts';

@Injectable({ providedIn: 'root' })
export class GovernanceApi {
  private readonly api = inject(ApiClient);

  listGrants(documentId: string) {
    return this.api.get<GovernanceGrantDto[]>(
      `document/${documentId}/governance/grants`,
      new HttpContext().set(SKIP_ERROR_PRESENTATION, true),
    );
  }

  createGrant(documentId: string, revision: string, command: CreateGovernanceGrantCommand) {
    return this.api.postResponse<CreateGovernanceGrantResult>(
      `document/${documentId}/governance/grants`,
      command,
      { headers: { 'If-Match': revision } },
    );
  }

  revokeGrant(documentId: string, grantId: string, revision: string, reason: string) {
    return this.api.deleteResponse<RevokeGovernanceGrantResult>(
      `document/${documentId}/governance/grants/${grantId}`,
      { reason },
      { headers: { 'If-Match': revision } },
    );
  }

  listSensitivityChanges(documentId: string) {
    return this.api.get<SensitivityChangeDto[]>(
      `document/${documentId}/governance/sensitivity-changes`,
      new HttpContext().set(SKIP_ERROR_PRESENTATION, true),
    );
  }

  requestSensitivityChange(
    documentId: string,
    revision: string,
    command: RequestSensitivityChangeCommand,
  ) {
    return this.api.postResponse<RequestSensitivityChangeResult>(
      `document/${documentId}/governance/sensitivity-changes`,
      command,
      { headers: { 'If-Match': revision } },
    );
  }

  listPendingSensitivityChanges(limit = 25, cursor?: string) {
    return this.api.get<PendingSensitivityChangesDto>(
      'document/governance/sensitivity-changes',
      undefined,
      { limit, ...(cursor ? { cursor } : {}) },
    );
  }

  reviewSensitivityChange(
    documentId: string,
    requestId: string,
    revision: string,
    decision: SensitivityDecision,
    reason: string,
  ) {
    return this.api.postResponse<ReviewSensitivityChangeResult>(
      `document/${documentId}/governance/sensitivity-changes/${requestId}/${decision}`,
      { reason },
      { headers: { 'If-Match': revision } },
    );
  }

  extract(documentId: string, revision: string, kind: 'export' | 'print') {
    return this.api.postBlobResponse(
      `document/${documentId}/extractions/${kind}`,
      {},
      { headers: { 'If-Match': revision } },
    );
  }
}
