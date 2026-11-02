import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideArrowRight,
  lucideBriefcaseBusiness,
  lucideRefreshCw,
  lucideSave,
  lucideSearch,
  lucideShieldCheck,
  lucideUserRoundCog,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import type {
  AdministrativeStaffDto,
  StaffStatus,
} from '../../../../api/identity/staff-administration.contracts';
import { ToastService } from '../../../../core/services/notifications/toast-service';
import { EmploymentType } from '../../../../enums/staff/employmentType.enum';
import { OrganizationService } from '../../../../features/shared/services/organization/organization-service';
import { OfficeContextService } from '../../../../office-platform/context/office-context.service';
import { Capabilities as C } from '../../../../platform/authorization/capabilities';
import { StaffAdministrationService } from '../../services/staff-administration.service';

@Component({
  selector: 'nexus-staff-administration',
  imports: [
    NgIcon,
    ReactiveFormsModule,
    HlmButtonImports,
    HlmCardImports,
    HlmInput,
    HlmSeparator,
    HlmTextarea,
  ],
  templateUrl: './staff-administration.html',
  providers: [
    provideIcons({
      lucideArrowLeft,
      lucideArrowRight,
      lucideBriefcaseBusiness,
      lucideRefreshCw,
      lucideSave,
      lucideSearch,
      lucideShieldCheck,
      lucideUserRoundCog,
    }),
  ],
})
class StaffAdministration implements OnInit {
  readonly administration = inject(StaffAdministrationService);
  readonly organization = inject(OrganizationService);
  readonly officeContext = inject(OfficeContextService);
  private readonly toast = inject(ToastService);

  readonly mode = signal<'detail' | 'edit' | 'status'>('detail');
  readonly employmentTypes = Object.values(EmploymentType);
  readonly statuses: StaffStatus[] = ['active', 'suspended', 'retired', 'resigned', 'terminated'];
  readonly selected = this.administration.selectedStaff;
  readonly offices = this.organization.officesInUnit;
  readonly units = this.organization.units;
  readonly designations = () => {
    const officeId = this.editForm.controls.officeId.value;
    return this.organization.officesDesignations().filter((item) => item.officeId === officeId);
  };

  readonly filters = new FormGroup({
    search: new FormControl('', { nonNullable: true }),
    status: new FormControl('', { nonNullable: true }),
    unitId: new FormControl('', { nonNullable: true }),
  });

  readonly editForm = new FormGroup({
    staffNumber: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    employmentType: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    unitId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    officeId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    designationId: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    reason: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  readonly statusForm = new FormGroup({
    toStatus: new FormControl<StaffStatus>('suspended', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    reason: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  async ngOnInit(): Promise<void> {
    this.organization.fetchUnits();
    this.organization.fetchAllDesignations();
    await this.loadStaff();
  }

  async loadStaff(page = 1): Promise<void> {
    const filters = this.filters.getRawValue();
    try {
      await this.administration.loadStaff({
        page,
        pageSize: 25,
        search: filters.search.trim() || undefined,
        status: (filters.status || undefined) as StaffStatus | undefined,
        unitId: filters.unitId || undefined,
      });
    } catch {
      // Normalized errors are presented globally and retained for the inline state.
    }
  }

  async openStaff(staff: AdministrativeStaffDto): Promise<void> {
    if (!this.can(C.Staff.View)) return;
    this.mode.set('detail');
    try {
      const detail = await this.administration.loadStaffDetail(staff.staffId);
      this.populateForms(detail);
    } catch {
      // Normalized errors are presented globally.
    }
  }

  startEdit(): void {
    const staff = this.selected();
    if (!staff || !this.can(C.Staff.Update)) return;
    this.populateForms(staff);
    this.mode.set('edit');
  }

  startStatusTransition(): void {
    const staff = this.selected();
    if (!staff) return;
    const fallback =
      this.statuses.find((status) => status !== staff.status && this.canTransitionTo(status)) ??
      'suspended';
    this.statusForm.reset({ toStatus: fallback, reason: '' });
    this.mode.set('status');
  }

  onUnitChange(unitId: string): void {
    this.editForm.patchValue({ officeId: '', designationId: '' });
    if (unitId) this.organization.fetchAllOffices(unitId);
  }

  onOfficeChange(): void {
    this.editForm.controls.designationId.setValue('');
  }

  async saveAdministrativeFields(): Promise<void> {
    if (this.editForm.invalid || this.administration.saving()) {
      this.editForm.markAllAsTouched();
      return;
    }
    const value = this.editForm.getRawValue();
    try {
      await this.administration.updateStaff({
        changes: {
          staffNumber: value.staffNumber!,
          employmentType: value.employmentType,
          unitId: value.unitId,
          officeId: value.officeId,
          designationId: value.designationId,
        },
        reason: value.reason.trim(),
      });
      this.mode.set('detail');
      this.toast.success('Staff employment details updated.');
    } catch {
      // A revision conflict refreshes the detail to the newest ETag automatically.
    }
  }

  async transitionStatus(): Promise<void> {
    if (this.statusForm.invalid || this.administration.saving()) {
      this.statusForm.markAllAsTouched();
      return;
    }
    const value = this.statusForm.getRawValue();
    if (!this.canTransitionTo(value.toStatus)) return;
    try {
      await this.administration.transitionStatus({
        toStatus: value.toStatus,
        reason: value.reason.trim(),
      });
      this.mode.set('detail');
      this.toast.success(`Staff status changed to ${value.toStatus}.`);
    } catch {
      // Policy, separation-of-duty and revision errors are normalized globally.
    }
  }

  can(capability: string): boolean {
    return this.officeContext.has(capability);
  }

  canTransitionTo(status: StaffStatus): boolean {
    return this.can(status === 'active' ? C.Staff.Activate : C.Staff.Deactivate);
  }

  formatDate(value: string | null): string {
    if (!value) return 'Never';
    return new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium', timeStyle: 'short' }).format(
      new Date(value),
    );
  }

  private populateForms(staff: AdministrativeStaffDto): void {
    this.editForm.reset({
      staffNumber: staff.staffNumber,
      employmentType: staff.employmentType,
      unitId: staff.unit.id,
      officeId: staff.office.id,
      designationId: staff.designation.id,
      reason: '',
    });
    this.organization.fetchAllOffices(staff.unit.id);
  }
}

export { StaffAdministration };
