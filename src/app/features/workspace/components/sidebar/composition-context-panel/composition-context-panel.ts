import { Component, computed, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { hugeCancelCircle } from '@ng-icons/huge-icons';
import { phosphorUsersDuotone } from '@ng-icons/phosphor-icons/duotone';
import {
  lucideFile,
  lucideInfo,
  lucidePanelLeftClose,
  lucidePanelRightClose,
  lucidePaperclip,
} from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { emptyDesignation } from '../../../../../models/api/organization/designation.api';
import { emptyUnit } from '../../../../../models/api/organization/units.api';
import { UnitMembersService } from '../../../../documents/service/unit-members/unit-members-service';
import { CurrentStaffService } from '../../../../shared/services/current-staff/current-staff-service';
import { OrganizationService } from '../../../../shared/services/organization/organization-service';
import { WorkspaceService } from '../../../service/data/workspace-service';
import { WorkspaceUiService } from '../../../service/ui/workspace-ui-service';

@Component({
  selector: 'nexus-composition-context-panel',
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatChipsModule,
    NgIcon,
    HlmIcon,
    HlmSeparator,
  ],
  templateUrl: './composition-context-panel.html',
  styleUrl: './composition-context-panel.css',
  viewProviders: [
    provideIcons({
      hugeCancelCircle,
      lucideFile,
      lucideInfo,
      lucidePanelLeftClose,
      lucidePanelRightClose,
      lucidePaperclip,
      phosphorUsersDuotone
    }),
  ],
})
export class CompositionContextPanel {
  private readonly workspaceService = inject(WorkspaceService);
  private readonly workspaceUiService = inject(WorkspaceUiService);
  private readonly organizationService = inject(OrganizationService);
  private readonly unitMembersService = inject(UnitMembersService);
  private readonly currentStaffService = inject(CurrentStaffService);

  readonly closed = input(false);
  readonly closedChange = output<boolean>();

  readonly ui = this.workspaceService.viewModel;
  readonly document = computed(() => this.ui().document);
  readonly correspondence = computed(() => this.document()?.correspondence);
  readonly canEditCc = computed(() => this.ui().permissions.editable && this.ui().permissions.canCc);
  readonly hidesCcOnCanvas = computed(() => this.ui().canvas?.visible === false);
  readonly isDocumentActive = computed(() => Boolean(this.document()?.currentVersion?.mediaId));

  readonly designations = this.organizationService.officesDesignations;
  readonly units = this.organizationService.units;
  readonly unitMembers = this.unitMembersService.data;
  readonly signedInStaff = this.currentStaffService.data;
  readonly selectedAdditionalAddressees = this.workspaceUiService.selectedAdditionalAddresseeIds;
  readonly searchValue = signal('');
  readonly fileUploaded = signal<File | null>(null);

  readonly ccForm = new FormGroup({
    internal: new FormControl('', { nonNullable: true }),
    external: new FormControl('', { nonNullable: true }),
  });

  readonly primaryInternalAddressee = computed(() => {
    const id = this.document()?.addressees.find((item) => item.isPrimary)?.addressedToDesignationId;
    return id ? this.getDesignation(id) : emptyDesignation;
  });

  readonly primaryExternalAddressee = computed(() => {
    const id = this.document()?.addressees.find((item) => item.isPrimary)?.recipientUnitId;
    return id ? this.getUnit(id) : emptyUnit;
  });

  readonly filteredInternalAddressees = computed(() => {
    const query = this.searchValue().toLowerCase();
    const primaryId = this.primaryInternalAddressee().id;
    const currentStaffId = this.signedInStaff()?.id;

    return this.unitMembers().filter((member) =>
      member.id !== currentStaffId
      && Boolean(member.designation?.id)
      && member.designation.id !== primaryId
      && !this.selectedAdditionalAddressees().includes(member.designation.id)
      && member.designation.title.toLowerCase().includes(query),
    );
  });

  readonly filteredExternalAddressees = computed(() => {
    const query = this.searchValue().toLowerCase();
    const primaryId = this.primaryExternalAddressee().id;

    return this.units().filter((unit) =>
      unit.id !== primaryId
      && !this.selectedAdditionalAddressees().includes(unit.id)
      && (unit.fullName.toLowerCase().includes(query) || unit.code.toLowerCase().includes(query)),
    );
  });

  readonly attachedDocuments = computed(() => {
    const document = this.document();
    const mediaId = document?.currentVersion?.mediaId?.trim();
    if (!document || !mediaId) return [];

    return [{
      id: mediaId,
      title: document.title || 'Attached document',
      description: `Version ${document.currentVersion?.versionNumber ?? 1}`,
    }];
  });

  toggle(): void {
    this.closedChange.emit(!this.closed());
  }

  getDesignation(id: string) {
    return this.designations().find((designation) => designation.id === id) ?? emptyDesignation;
  }

  getUnit(id: string) {
    return this.units().find((unit) => unit.id === id) ?? emptyUnit;
  }

  displayDesignation = (id: string): string => {
    const title = this.getDesignation(id).title;
    return title ? `The ${title}` : '';
  };

  displayUnit = (id: string): string => this.getUnit(id).code;

  selectInternal(event: MatAutocompleteSelectedEvent): void {
    this.addAddressee(event.option.value as string);
    this.ccForm.controls.internal.setValue('');
    event.option.deselect();
  }

  selectExternal(event: MatAutocompleteSelectedEvent): void {
    this.addAddressee(event.option.value as string);
    this.ccForm.controls.external.setValue('');
    event.option.deselect();
  }

  removeAddressee(id: string): void {
    this.updateAddressees(this.selectedAdditionalAddressees().filter((item) => item !== id));
  }

  updateSearch(event: Event): void {
    this.searchValue.set((event.target as HTMLInputElement).value);
  }

  onUploadAttachment(event: Event): void {
    this.fileUploaded.set((event.target as HTMLInputElement).files?.[0] ?? null);
  }

  private addAddressee(id: string): void {
    const selected = this.selectedAdditionalAddressees();
    if (!selected.includes(id)) this.updateAddressees([...selected, id]);
    this.searchValue.set('');
  }

  private updateAddressees(ids: string[]): void {
    const external = this.correspondence()?.direction === 'external';
    const labels = ids
      .map((id) => external ? this.getUnit(id).code : this.getDesignation(id).title)
      .filter(Boolean);
    const description = labels.length
      ? `Additional addressees: ${labels.join(', ')}.`
      : 'All additional addressees will be removed.';

    this.workspaceUiService.updateAdditionalAddressees(ids, description);
  }
}
