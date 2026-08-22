import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideHistory,
  lucideKeyRound,
  lucideShieldCheck,
  lucideTrash2,
} from '@ng-icons/lucide';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import type {
  DocumentSensitivity,
  GovernanceGrantDto,
  GovernanceGrantType,
} from '../../../../api/documents/governance.contracts';
import { GovernanceService } from '../../service/data/governance-service';
import { WorkspaceService } from '../../service/data/workspace-service';

@Component({
  selector: 'nexus-governance-panel',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    NgIcon,
    HlmAlertDialogImports,
    HlmSeparator,
    HlmSpinner,
  ],
  templateUrl: './governance-panel.html',
  providers: [provideIcons({
    lucideHistory,
    lucideKeyRound,
    lucideShieldCheck,
    lucideTrash2,
  })],
})
export class GovernancePanel {
  private readonly workspaceService = inject(WorkspaceService);
  readonly governanceService = inject(GovernanceService);

  readonly workspace = this.workspaceService.workspaceContext;
  readonly document = this.workspaceService.workspaceContextDocument;
  readonly governance = computed(() => this.workspace()?.governance ?? null);
  readonly isAuthor = this.workspaceService.isAuthor;
  readonly currentSensitivity = computed<DocumentSensitivity>(() =>
    this.normalizeSensitivity(this.document()?.classification.sensitivity),
  );
  readonly isConfidential = computed(() => this.currentSensitivity() === 'confidential');
  readonly hasUnsavedChanges = computed(() => !this.workspaceService.workspaceUiService.getIsDocumentSaved()());
  readonly grants = this.governanceService.grants;
  readonly changes = this.governanceService.sensitivityChanges;
  readonly selectedGrant = signal<GovernanceGrantDto | null>(null);
  readonly sensitivities: DocumentSensitivity[] = ['public', 'internal', 'confidential', 'restricted'];
  readonly minimumExpiry = this.toLocalDateTime(new Date(Date.now() + 60_000));

  readonly grantForm = new FormGroup({
    granteeStaffId: new FormControl('', { nonNullable: true, validators: Validators.required }),
    grantType: new FormControl<GovernanceGrantType>('guest_reader', {
      nonNullable: true,
      validators: Validators.required,
    }),
    validTo: new FormControl(this.toLocalDateTime(new Date(Date.now() + 24 * 60 * 60 * 1000)), {
      nonNullable: true,
      validators: Validators.required,
    }),
    remainingUses: new FormControl<number | null>(null, Validators.min(1)),
    reason: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(2000)],
    }),
  });

  readonly sensitivityForm = new FormGroup({
    targetSensitivity: new FormControl<DocumentSensitivity>('internal', {
      nonNullable: true,
      validators: Validators.required,
    }),
    reason: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(2000)],
    }),
  });

  readonly revocationReason = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(2000)],
  });

  private readonly loadGovernanceEffect = effect(() => {
    const documentId = this.document()?.id;
    if (documentId) this.governanceService.loadDocumentGovernance(documentId);
  });

  createGrant(): void {
    if (this.grantForm.invalid || this.hasUnsavedChanges()) {
      this.grantForm.markAllAsTouched();
      return;
    }

    const value = this.grantForm.getRawValue();
    const validTo = new Date(value.validTo);
    if (Number.isNaN(validTo.valueOf()) || validTo <= new Date()) {
      this.grantForm.controls.validTo.setErrors({ futureDate: true });
      return;
    }

    this.governanceService.createGrant({
      granteeStaffId: value.granteeStaffId.trim(),
      grantType: value.grantType,
      validTo: validTo.toISOString(),
      remainingUses: value.grantType === 'export' ? value.remainingUses : null,
      reason: value.reason.trim(),
    });
  }

  requestSensitivityChange(): void {
    if (this.sensitivityForm.invalid || this.hasUnsavedChanges()) {
      this.sensitivityForm.markAllAsTouched();
      return;
    }

    const value = this.sensitivityForm.getRawValue();
    this.governanceService.requestSensitivityChange({
      targetSensitivity: value.targetSensitivity,
      reason: value.reason.trim(),
    });
  }

  revokeGrant(): void {
    const grant = this.selectedGrant();
    if (!grant || this.revocationReason.invalid || this.hasUnsavedChanges()) {
      this.revocationReason.markAsTouched();
      return;
    }

    this.governanceService.revokeGrant(grant.id, this.revocationReason.value.trim());
    this.revocationReason.reset('');
  }

  reasonLabel(reasonCode: string): string {
    return reasonCode.replaceAll('_', ' ');
  }

  private normalizeSensitivity(value: unknown): DocumentSensitivity {
    const normalized = String(value ?? 'internal').toLowerCase();
    return this.sensitivities.includes(normalized as DocumentSensitivity)
      ? normalized as DocumentSensitivity
      : 'internal';
  }

  private toLocalDateTime(date: Date): string {
    const offset = date.getTimezoneOffset() * 60_000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  }
}
