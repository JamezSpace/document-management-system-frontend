import { DatePipe } from '@angular/common';
import { Component, computed, inject, input, OnInit, output } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideActivity,
  lucideFileText,
  lucidePanelLeftClose,
  lucidePanelRightClose,
  lucideShieldCheck,
  lucideWorkflow,
} from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { officeActivityContext } from '../../../../../office-platform/activity/office-activity.context';
import { BusinessFunctionService } from '../../../../documents/service/business-function/business-function-service';
import { CorrespondenceSubjectService } from '../../../../documents/service/correspondence-subject/correspondence-subject-service';
import { DocumentTypesService } from '../../../../documents/service/document-types/document-types-service';
import { MinutesService } from '../../../../documents/service/minutes/minutes-service';
import { CurrentStaffService } from '../../../../shared/services/current-staff/current-staff-service';
import { OrganizationService } from '../../../../shared/services/organization/organization-service';
import { GovernancePanel } from '../../governance/governance-panel';
import { WorkspaceService } from '../../../service/data/workspace-service';

@Component({
  selector: 'nexus-document-inspector',
  imports: [DatePipe, NgIcon, HlmIcon, GovernancePanel, MatTabsModule],
  templateUrl: './document-inspector.html',
  styleUrl: './document-inspector.css',
  providers: [
    provideIcons({
      lucideActivity,
      lucideFileText,
      lucidePanelLeftClose,
      lucidePanelRightClose,
      lucideShieldCheck,
      lucideWorkflow,
    }),
  ],
})
export class DocumentInspector implements OnInit {
  private readonly workspaceService = inject(WorkspaceService);
  private readonly businessFunctionService = inject(BusinessFunctionService);
  private readonly correspondenceSubjectService = inject(CorrespondenceSubjectService);
  private readonly documentTypesService = inject(DocumentTypesService);
  private readonly organizationService = inject(OrganizationService);
  private readonly currentStaffService = inject(CurrentStaffService);
  private readonly minutesService = inject(MinutesService);

  readonly closed = input(false);
  readonly closedChange = output<boolean>();

  readonly workspace = this.workspaceService.workspaceContext;
  readonly document = this.workspaceService.workspaceContextDocument;
  readonly documentType = this.documentTypesService.docType;
  readonly correspondenceSubjectName = computed(() => {
    const subjectId = this.document()?.correspondence.subjectCodeId;
    if (!subjectId) return 'Not provided';

    return this.correspondenceSubjectService
      .corrSubjects()
      .find((subject) => subject.id === subjectId)?.name ?? 'Unavailable';
  });
  readonly businessFunctionName = computed(() => {
    const functionId = this.document()?.classification.functionCodeId;
    if (!functionId) return 'Not provided';

    return this.businessFunctionService
      .bussFunctions()
      .find((businessFunction) => businessFunction.id === functionId)?.name ?? 'Unavailable';
  });
  readonly workflow = computed(() => this.workspace()?.workflow ?? null);
  readonly governance = computed(() => this.workspace()?.governance ?? null);
  readonly requiredGrants = computed(() => {
    const governance = this.governance();
    if (!governance) return [];

    return [
      ...new Set([
        ...governance.extraction.print.obligations,
        ...governance.extraction.export.obligations,
      ]),
    ];
  });
  readonly minutes = this.minutesService.minutes;
  readonly owner = computed(() => {
    const document = this.document();
    const currentStaff = this.currentStaffService.data();
    return document && currentStaff?.id === document.ownerId ? currentStaff : null;
  });
  readonly originatingUnitName = computed(() => {
    const id = this.document()?.correspondence.originatingUnitId;
    return (
      this.organizationService.units().find((unit) => unit.id === id)?.fullName ??
      id ??
      'Unavailable'
    );
  });

  ngOnInit(): void {
    if (!this.correspondenceSubjectService.corrSubjects().length) {
      this.correspondenceSubjectService.fetchCorrSubjects(officeActivityContext());
    }

    if (!this.businessFunctionService.bussFunctions().length) {
      this.businessFunctionService.fetchBussFunctions(officeActivityContext());
    }
  }

  toggle(): void {
    this.closedChange.emit(!this.closed());
  }

  displayValue(value: unknown): string {
    if (value === null || value === undefined || value === '') return 'Not provided';
    return String(value);
  }

  statusLabel(): string {
    const workflow = this.workflow();
    if (!workflow) return 'Not yet submitted into a workflow';
    if (workflow.rejected) return 'Rejected';
    if (workflow.completed) return 'Completed';
    return 'In progress';
  }

  obligationLabel(value: string): string {
    return value.replaceAll('_', ' ');
  }
}
