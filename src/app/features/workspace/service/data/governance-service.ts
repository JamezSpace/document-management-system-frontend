import { inject, Injectable, signal } from '@angular/core';
import { finalize, switchMap } from 'rxjs';
import { GovernanceApi } from '../../../../api/documents/governance.api';
import type {
  CreateGovernanceGrantCommand,
  GovernanceGrantDto,
  PendingSensitivityChangesDto,
  RequestSensitivityChangeCommand,
  SensitivityChangeDto,
  SensitivityDecision,
} from '../../../../api/documents/governance.contracts';
import { WorkspaceApi } from '../../../../api/workspace/workspace.api';
import type { AppError } from '../../../../models/ui/global/ErrorPresentation.ui';
import { UtilService } from '../../../../shared/utils/service/util-service';
import { WorkspaceService } from './workspace-service';

@Injectable({ providedIn: 'root' })
export class GovernanceService {
  private readonly api = inject(GovernanceApi);
  private readonly workspaceApi = inject(WorkspaceApi);
  private readonly workspaceService = inject(WorkspaceService);
  private readonly utilService = inject(UtilService);

  readonly grants = signal<GovernanceGrantDto[]>([]);
  readonly sensitivityChanges = signal<SensitivityChangeDto[]>([]);
  readonly pendingSensitivityChanges = signal<PendingSensitivityChangesDto | null>(null);
  readonly loading = signal(false);
  readonly mutating = signal(false);
  readonly extracting = signal<'export' | 'print' | null>(null);

  loadDocumentGovernance(documentId: string): void {
    this.loadGrants(documentId);
    this.loadSensitivityChanges(documentId);
  }

  loadGrants(documentId: string): void {
    this.loading.set(true);
    this.api.listGrants(documentId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => this.grants.set(response.data),
        error: () => this.grants.set([]),
      });
  }

  loadSensitivityChanges(documentId: string): void {
    this.loading.set(true);
    this.api.listSensitivityChanges(documentId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => this.sensitivityChanges.set(response.data),
        error: () => this.sensitivityChanges.set([]),
      });
  }

  createGrant(command: CreateGovernanceGrantCommand): void {
    const context = this.currentMutationContext();
    if (!context) return;

    this.mutating.set(true);
    this.api.createGrant(context.documentId, context.revision, command)
      .pipe(finalize(() => this.mutating.set(false)))
      .subscribe({
        next: (response) => {
          const result = response.body?.data;
          if (!result) return;
          this.workspaceService.acceptMutationRevision(result.documentRevision, response.headers.get('ETag'));
          this.afterWorkspaceMutation(context.documentId, 'Confidential access grant created.');
        },
        error: (error: AppError) => this.handleMutationError(error, context.documentId),
      });
  }

  revokeGrant(grantId: string, reason: string): void {
    const context = this.currentMutationContext();
    if (!context) return;

    this.mutating.set(true);
    this.api.revokeGrant(context.documentId, grantId, context.revision, reason)
      .pipe(finalize(() => this.mutating.set(false)))
      .subscribe({
        next: (response) => {
          const result = response.body?.data;
          if (!result) return;
          this.workspaceService.acceptMutationRevision(result.documentRevision, response.headers.get('ETag'));
          this.afterWorkspaceMutation(context.documentId, 'Governance grant revoked.');
        },
        error: (error: AppError) => this.handleMutationError(error, context.documentId),
      });
  }

  requestSensitivityChange(command: RequestSensitivityChangeCommand): void {
    const context = this.currentMutationContext();
    if (!context) return;

    this.mutating.set(true);
    this.api.requestSensitivityChange(context.documentId, context.revision, command)
      .pipe(finalize(() => this.mutating.set(false)))
      .subscribe({
        next: (response) => {
          const result = response.body?.data;
          if (!result) return;
          const revision = result.documentRevision;
          if (revision) {
            this.workspaceService.acceptMutationRevision(revision, response.headers.get('ETag'));
          }
          const message = result.status === 'pending'
            ? 'Sensitivity downgrade submitted for Unit Head approval.'
            : 'Document sensitivity updated.';
          this.afterWorkspaceMutation(context.documentId, message);
        },
        error: (error: AppError) => this.handleMutationError(error, context.documentId),
      });
  }

  loadPendingSensitivityChanges(limit = 25, cursor?: string, append = false): void {
    this.loading.set(true);
    this.api.listPendingSensitivityChanges(limit, cursor)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.pendingSensitivityChanges.update((current) => ({
            items: append && current
              ? [...current.items, ...response.data.items]
              : response.data.items,
            pageInfo: response.data.pageInfo,
          }));
        },
      });
  }

  reviewSensitivityChange(
    request: SensitivityChangeDto,
    decision: SensitivityDecision,
    reason: string,
  ): void {
    this.mutating.set(true);
    this.workspaceApi.get(request.documentId)
      .pipe(
        switchMap((workspaceResponse) => {
          const workspace = workspaceResponse.body?.data;
          const revision = workspaceResponse.headers.get('ETag')
            ?? (workspace ? `"${workspace.metadata.document.revision}"` : '');
          return this.api.reviewSensitivityChange(
            request.documentId,
            request.id,
            revision,
            decision,
            reason,
          );
        }),
        finalize(() => this.mutating.set(false)),
      )
      .subscribe({
        next: () => {
          this.utilService.showToast(
            'info',
            decision === 'approve' ? 'Sensitivity downgrade approved.' : 'Sensitivity downgrade rejected.',
          );
          this.loadPendingSensitivityChanges();
        },
        error: (error: AppError) => this.handleMutationError(error, request.documentId, true),
      });
  }

  extract(kind: 'export' | 'print'): void {
    const context = this.currentMutationContext();
    if (!context) return;

    const previewWindow = kind === 'print' ? window.open('', '_blank') : null;
    this.extracting.set(kind);
    this.api.extract(context.documentId, context.revision, kind)
      .pipe(finalize(() => this.extracting.set(null)))
      .subscribe({
        next: (response) => {
          const pdf = response.body;
          if (!pdf) return;

          const etag = response.headers.get('ETag');
          const revision = this.parseRevision(etag);
          if (revision) this.workspaceService.acceptMutationRevision(revision, etag);

          const objectUrl = URL.createObjectURL(pdf);
          if (kind === 'export') {
            const link = document.createElement('a');
            link.href = objectUrl;
            link.download = this.resolveFilename(response.headers.get('Content-Disposition'));
            link.click();
          } else if (previewWindow) {
            previewWindow.location.href = objectUrl;
          }

          setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
          this.workspaceService.fetchWorkspaceContext(context.documentId);
        },
        error: (error: AppError) => {
          previewWindow?.close();
          this.handleMutationError(error, context.documentId);
        },
      });
  }

  private currentMutationContext(): { documentId: string; revision: string } | null {
    const document = this.workspaceService.workspaceContextDocument();
    const revision = this.workspaceService.currentRevisionHeader();
    return document && revision ? { documentId: document.id, revision } : null;
  }

  private afterWorkspaceMutation(documentId: string, message: string): void {
    this.utilService.showToast('info', message);
    this.workspaceService.fetchWorkspaceContext(documentId);
    this.loadDocumentGovernance(documentId);
  }

  private handleMutationError(error: AppError, documentId: string, queue = false): void {
    if (error.apiError.code.codeName !== 'stale_governance_decision') return;

    if (queue) {
      this.loadPendingSensitivityChanges();
    } else {
      this.workspaceService.fetchWorkspaceContext(documentId);
      this.loadDocumentGovernance(documentId);
    }
    this.utilService.showToast('info', 'The document changed. Current governance data was refreshed; please retry.');
  }

  private parseRevision(etag: string | null): number | null {
    if (!etag) return null;
    const revision = Number(etag.replace(/^W\//, '').replaceAll('"', ''));
    return Number.isInteger(revision) && revision > 0 ? revision : null;
  }

  private resolveFilename(contentDisposition: string | null): string {
    const match = contentDisposition?.match(/filename="?([^";]+)"?/i);
    return match?.[1] ?? 'document.pdf';
  }
}
