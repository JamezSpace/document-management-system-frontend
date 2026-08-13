import { computed, inject, Injectable } from '@angular/core';
import { AppContextService } from '../../core/services/app-context/app-context.service';
import type { OfficeWorkbenchDefinition } from '../models/office-navigation';
import type { OfficeWorkbenchKey } from '../models/office-workbench';
import { isOfficeWorkbenchKey } from '../models/office-workbench';
import { WorkbenchRegistry } from '../registry/workbench-registry';

export interface ActiveOfficeContext {
  officeId: string;
  officeName: string;
  unitId: string;
  workbench: OfficeWorkbenchKey;
  definition: OfficeWorkbenchDefinition;
}

@Injectable({ providedIn: 'root' })
export class OfficeContextService {
  private readonly appContext = inject(AppContextService);
  private readonly registry = inject(WorkbenchRegistry);

  readonly active = computed<ActiveOfficeContext | null>(() => {
    const actor = this.appContext.actor();
    if (!actor) return null;

    const workbench = this.resolveWorkbench(actor.office.workbench);
    return {
      officeId: actor.office.id,
      officeName: actor.office.name,
      unitId: actor.unit.id,
      workbench,
      definition: this.registry.get(workbench),
    };
  });

  readonly baseRoute = computed(() => {
    const context = this.active();
    return context ? `/office/${context.workbench}` : '/office';
  });

  route(...segments: string[]): string {
    return [this.baseRoute(), ...segments].filter(Boolean).join('/');
  }

  has(capability: string): boolean {
    return this.appContext.can(capability);
  }

  hasAny(capabilities: string[] = []): boolean {
    return capabilities.some((capability) => this.has(capability));
  }

  canEnter(workbench: OfficeWorkbenchKey): boolean {
    const active = this.active();
    if (!active || active.workbench !== workbench) return false;
    const required = active.definition.accessCapabilities;
    return required.length === 0 || this.hasAny(required);
  }

  private resolveWorkbench(explicitWorkbench: unknown): OfficeWorkbenchKey {
    if (isOfficeWorkbenchKey(explicitWorkbench)) return explicitWorkbench;

    // Compatibility boundary for older identity responses. The backend should send
    // office.workbench; capability/assignment inference can then be removed.
    const actor = this.appContext.actor();
    const capabilities = this.appContext.capabilities();
    const roles = actor?.authority.roleAssignments.map((assignment) => assignment.role.toLowerCase()) ?? [];
    const identityText = [actor?.office.name, actor?.designation.title, ...roles]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    if (capabilities.has('system.configure')) return 'system-administration';
    if (capabilities.has('audit.view')) return 'audit-compliance';
    if (capabilities.has('staff.activate') || capabilities.has('staff.create')) return 'human-resources';
    if (capabilities.has('directive.issue') || capabilities.has('document.approve')) return 'leadership';
    if (capabilities.has('record.register') || capabilities.has('record.archive')) return 'records';
    if (identityText.includes('secretar')) return 'secretariat';
    return 'processing';
  }
}
