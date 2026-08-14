import { Component, computed, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { hugeCancelCircle } from '@ng-icons/huge-icons';
import {
  lucideFile,
  lucideHistory,
  lucideLock,
  lucideLockOpen,
  lucidePanelLeftClose,
  lucidePanelRightClose,
} from '@ng-icons/lucide';
import { BrnAlertDialogTrigger } from '@spartan-ng/brain/alert-dialog';
import { HlmAccordionImports } from '@spartan-ng/helm/accordion';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { MinuteAction } from '../../../../enums/document/minute.enum';
import { MinutesService } from '../../../documents/service/minutes/minutes-service';
import { UnitMembersService } from '../../../documents/service/unit-members/unit-members-service';
import { CurrentStaffService } from '../../../shared/services/current-staff/current-staff-service';
import { OrganizationService } from '../../../shared/services/organization/organization-service';
import { UtilService } from '../../../../shared/utils/service/util-service';
import { emptyDesignation } from '../../../../models/api/organization/designation.api';
import { emptyUnit } from '../../../../models/api/organization/units.api';
import { WorkspaceService } from '../../service/data/workspace-service';

@Component({
  selector: 'nexus-sidebar',
  imports: [
    NgIcon,
    MatAutocompleteModule,
    MatChipsModule,
    FormsModule,
    ReactiveFormsModule,
    HlmAccordionImports,
    HlmAlertDialogImports,
    HlmCheckboxImports,
    HlmIcon,
    HlmSeparator,
    HlmSpinnerImports,
    BrnAlertDialogTrigger,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  viewProviders: [
    provideIcons({
      lucideFile,
      lucideHistory,
      lucideLock,
      lucideLockOpen,
      lucidePanelLeftClose,
      lucidePanelRightClose,
      hugeCancelCircle,
    }),
  ],
})
export class Sidebar {
  private readonly workspaceService = inject(WorkspaceService);
  private readonly organizationService = inject(OrganizationService);
  private readonly unitMembersService = inject(UnitMembersService);
  private readonly currentStaffService = inject(CurrentStaffService);
  private readonly minutesService = inject(MinutesService);
  private readonly utilService = inject(UtilService);

  readonly ui = this.workspaceService.viewModel;
  readonly uiDocument = computed(() => this.ui().document);
  readonly uiDocumentCorrespondence = computed(() => this.uiDocument()?.correspondence);
  readonly isEditable = computed(() => this.ui().permissions.editable);
  readonly isDocumentActive = computed(() => Boolean(this.uiDocument()?.currentVersion?.mediaId));

  readonly designations = this.organizationService.officesDesignations;
  readonly units = this.organizationService.units;
  readonly unitMembers = this.unitMembersService.data;
  readonly minutes = this.minutesService.minutes;
  readonly minuteServiceInOperation = this.minutesService.loading;
  readonly signedInStaff = this.currentStaffService.data;

  readonly sidebarClosed = input(false);
  readonly sidebarClosedChange = output<boolean>();
  readonly isLockedForEditing = signal(false);
  readonly numOfFilesAttached = signal(0);
  readonly fileUploaded = signal<File | null>(null);
  readonly selectedUnitsForCC = signal<string[]>([]);
  readonly selectedDesignationsForCC = signal<string[]>([]);
  readonly searchUnitValue = signal('');
  readonly searchAddresseeValue = signal('');
  readonly minuteContentToBeAdded = signal('');

  isMinuting = false;
  isForwarding = false;

  readonly documentMetadata = new FormGroup({
    addresseesForInternalDocs: new FormControl('', { nonNullable: true, validators: Validators.required }),
    addresseesForExternalDocs: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });

  readonly forwardCorrespondenceFormGroup = new FormGroup({
    forwardToDesignationId: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });

  readonly attachedDocuments = computed(() => {
    const doc = this.uiDocument();
    const mediaId = doc?.currentVersion?.mediaId?.trim();

    if (!doc || !mediaId) return [];

    return [{
      id: mediaId,
      title: doc.title || 'Attached document',
      description: `Version ${doc.currentVersion?.versionNumber ?? 1} attachment`,
      mediaId,
    }];
  });

  readonly primaryAddresseeForInternalDocs = computed(() => {
    const designationId = this.uiDocument()?.addressees.find((addressee) => addressee.isPrimary)
      ?.addressedToDesignationId;
    return designationId ? this.getDesignationFromId(designationId) : emptyDesignation;
  });

  readonly primaryAddresseeForExternalDocs = computed(() => {
    const unitId = this.uiDocument()?.addressees.find((addressee) => addressee.isPrimary)
      ?.recipientUnitId;
    return unitId ? this.getUnitFromId(unitId) : emptyUnit;
  });

  readonly filteredUnitsForCC = computed(() => {
    const primaryAddresseeUnitId = this.primaryAddresseeForExternalDocs().id;
    const filterValue = this.searchUnitValue().toLowerCase();

    return this.units().filter(
      (unit) => unit.id !== primaryAddresseeUnitId && unit.fullName.toLowerCase().includes(filterValue),
    );
  });

  readonly filteredUnitMembers = computed(() => {
    const typedValue = this.searchAddresseeValue().toLowerCase();
    const signedInStaffId = this.signedInStaff()?.id;

    return this.unitMembers().filter(
      (member) =>
        member.id !== signedInStaffId &&
        Boolean(member.designation?.id) &&
        member.designation!.title.toLowerCase().includes(typedValue),
    );
  });

  readonly filteredUnitMembersForCC = computed(() => {
    const primaryAddresseeId = this.primaryAddresseeForInternalDocs().id;
    return this.filteredUnitMembers().filter((member) => member.id !== primaryAddresseeId);
  });

  readonly isMinuteAdded = computed(() => this.minuteContentToBeAdded().trim().length === 0);
  readonly formatDate = this.utilService.formatDateAsReadableString;

  toggleLockedForEditing() {
    this.isLockedForEditing.update((locked) => !locked);
  }

  toggleSidebar() {
    this.sidebarClosedChange.emit(!this.sidebarClosed());
  }

  getDesignationFromId(designationId: string) {
    return this.designations().find((designation) => designation.id === designationId) ?? emptyDesignation;
  }

  getUnitFromId(unitId: string) {
    return this.units().find((unit) => unit.id === unitId) ?? emptyUnit;
  }

  showDesignationTitleRatherThanId = (designationId: string) => {
    const title = this.getDesignationFromId(designationId).title;
    return title ? `The ${title}` : '';
  };

  showUnitLabelRatherThanId = (unitId: string) => this.getUnitFromId(unitId).code;

  selectedDesig(event: MatAutocompleteSelectedEvent) {
    this.selectedDesignationsForCC.update((selected) => [...selected, event.option.viewValue]);
    event.option.deselect();
  }

  selectedUnit(event: MatAutocompleteSelectedEvent) {
    this.selectedUnitsForCC.update((selected) => [...selected, event.option.viewValue]);
    event.option.deselect();
  }

  removeDesig(designationId: string) {
    this.selectedDesignationsForCC.update((selected) => selected.filter((id) => id !== designationId));
  }

  removeUnit(unitId: string) {
    this.selectedUnitsForCC.update((selected) => selected.filter((id) => id !== unitId));
  }

  updateUnitSearch(event: Event) {
    this.searchUnitValue.set((event.target as HTMLInputElement).value);
  }

  updateAddressee(event: Event) {
    this.searchAddresseeValue.set((event.target as HTMLInputElement).value);
  }

  onUploadAttachment(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    if (!file) return;

    this.fileUploaded.set(file);
    this.numOfFilesAttached.update((count) => count + 1);
  }

  changeMinute(event: Event) {
    this.minuteContentToBeAdded.set((event.target as HTMLTextAreaElement).value);
  }

  resolveStaffDesignationTitle(staffId: string) {
    const staff = this.unitMembers().find((member) => member.id === staffId);
    if (!staff) return 'n/a';
    if (staff.id === this.signedInStaff()?.id) return 'you';
    return `the ${staff.designation?.title ?? 'staff member'}`;
  }

  resolveMinuteAction(action: MinuteAction) {
    if (action === MinuteAction.COMMENT) return 'minuted';
    if (action === MinuteAction.FORWARD) return 'forwarded';
    return 'acknowledged';
  }

  resolveMinuteContent(content: string | null) {
    return content ?? '';
  }

  getStaffMinuteIfExistsBefore() {
    const staffId = this.signedInStaff()?.id;
    const foundMinute = staffId ? this.minutes().find((minute) => minute.authorStaffId === staffId) : undefined;
    return { existsBefore: Boolean(foundMinute), foundMinute: foundMinute ?? null };
  }

  addMinuteToCorrespondence() {
    const documentId = this.uiDocument()?.id;
    const staffId = this.signedInStaff()?.id;
    if (!documentId || !staffId) return;

    const content = this.minuteContentToBeAdded().trim();
    const previousMinute = this.getStaffMinuteIfExistsBefore();
    this.minutesService.addMinuteToCorrespondence(documentId, {
      authorStaffId: staffId,
      action: content ? MinuteAction.COMMENT : MinuteAction.ACKNOWLEDGE,
      content: content || null,
      parentMinuteId: previousMinute.foundMinute?.id ?? null,
    });

    this.minuteContentToBeAdded.set('');
    this.isMinuting = false;
  }

  forwardDocument() {
    const documentId = this.uiDocument()?.id;
    const staffId = this.signedInStaff()?.id;
    const designationId = this.forwardCorrespondenceFormGroup.getRawValue().forwardToDesignationId.trim();
    if (!documentId || !staffId || !designationId) return;

    this.minutesService.addMinuteToCorrespondence(documentId, {
      authorStaffId: staffId,
      action: MinuteAction.FORWARD,
      content: this.showDesignationTitleRatherThanId(designationId) || designationId,
    });
    this.addMinuteToCorrespondence();
  }
}
