import { Injectable } from '@angular/core';
import { Capabilities as C } from '../../platform/authorization/capabilities';
import type { OfficeNavigationItem, OfficeWorkbenchDefinition } from '../models/office-navigation';
import type { OfficeWorkbenchKey } from '../models/office-workbench';

const item = (
  label: string,
  icon: string,
  route: string,
  capability?: string,
  anyCapabilities?: string[],
): OfficeNavigationItem => ({ label, icon, route, capability, anyCapabilities });

const personal = {
  label: 'Personal',
  items: [
    item('Work overview', 'lucideLayoutDashboard', 'overview'),
    item('My documents', 'lucideFiles', 'documents', C.Document.View),
    item('Notices', 'lucideBell', 'notices', C.Notice.View),
  ],
};

const definitions: OfficeWorkbenchDefinition[] = [
  {
    key: 'records',
    label: 'Records & Registry',
    summary: 'Official intake, registration, routing, custody, retention and disposition of records.',
    landingRoute: 'overview',
    accessCapabilities: [C.Record.View, C.Record.Register, C.Record.Archive],
    navigation: [personal, { label: 'Registry operations', items: [
      item('Document intake', 'lucideScanLine', 'intake', undefined, [C.Record.Register, C.Record.Archive]),
      item('Incoming register', 'lucideInbox', 'incoming-register', undefined, [C.Record.View, C.Record.Archive]),
      item('Outgoing register', 'lucideSend', 'outgoing-register', undefined, [C.Record.View, C.Record.Archive]),
      item('Classification & indexing', 'lucideTags', 'classification', C.Record.Classify),
      item('Routing & distribution', 'lucideRoute', 'routing', undefined, [C.Record.Route, C.Workflow.Forward]),
      item('Records repository', 'lucideLibrary', 'repository', undefined, [C.Record.View, C.Record.Archive]),
      item('Archives', 'lucideArchive', 'archives', C.Record.Archive),
      item('Retention & disposition', 'lucideCalendarClock', 'retention', undefined, [C.Record.Archive, C.Record.Dispose]),
      item('Registry audit trail', 'lucideHistory', 'audit-trail', undefined, [C.Audit.View, C.Record.Archive]),
    ] }],
  },
  {
    key: 'secretariat',
    label: 'Secretariat',
    summary: 'Executive correspondence, signatures, meetings, minutes and administrative coordination.',
    landingRoute: 'overview',
    accessCapabilities: [C.Document.View, C.Workflow.Forward],
    navigation: [personal, { label: 'Secretariat operations', items: [
      item('Executive inbox', 'lucideInbox', 'executive-inbox', C.Document.View),
      item('Correspondence register', 'lucideBookOpen', 'correspondence-register', C.Document.View),
      item('Attention queue', 'lucideListTodo', 'attention-queue', C.Workflow.Forward),
      item('Drafts & briefs', 'lucideFilePenLine', 'drafts', C.Document.Create),
      item('Signature queue', 'lucidePenTool', 'signature-queue', undefined, [C.Document.Sign, C.Workflow.Forward]),
      item('Meetings', 'lucideCalendarDays', 'meetings'),
      item('Minutes & action items', 'lucideClipboardCheck', 'minutes'),
      item('Dispatch tracking', 'lucideSend', 'dispatch', C.Workflow.Forward),
      item('Executive archive', 'lucideArchive', 'executive-archive', C.Document.View),
    ] }],
  },
  {
    key: 'processing',
    label: 'Processing',
    summary: 'Operational queues for assigned documents, reviews, recommendations and completed work.',
    landingRoute: 'overview',
    accessCapabilities: [C.Document.View, C.Workflow.Forward],
    navigation: [personal, { label: 'Operations', items: [
      item('My work queue', 'lucideListTodo', 'work-queue', undefined, [C.Workflow.View, C.Workflow.Forward]),
      item('Assigned documents', 'lucideFiles', 'assigned-documents', C.Document.View),
      item('Reviews & minutes', 'lucideMessageSquareText', 'reviews', C.Document.View),
      item('Returned work', 'lucideUndo2', 'returned', C.Document.View),
      item('Escalated items', 'lucideTriangleAlert', 'escalated', undefined, [C.Workflow.View, C.Workflow.Escalate]),
      item('Completed work', 'lucideCircleCheckBig', 'completed', C.Document.View),
    ] }],
  },
  {
    key: 'leadership',
    label: 'Leadership & Approvals',
    summary: 'Decision, approval, direction, escalation and operational oversight.',
    landingRoute: 'overview',
    accessCapabilities: [C.Directive.Issue, C.Document.Approve, C.Document.Sign],
    navigation: [personal, { label: 'Authority desk', items: [
      item('Approval inbox', 'lucideBadgeCheck', 'approvals', undefined, [C.Document.Approve, C.Document.Sign]),
      item('Signature queue', 'lucidePenTool', 'signature-queue', C.Document.Sign),
      item('Escalations', 'lucideTriangleAlert', 'escalations', undefined, [C.Workflow.Escalate, C.Directive.Issue]),
      item('Unit control', 'lucideZap', 'unit-control', C.Directive.Issue),
      item('Directives log', 'lucideClipboardList', 'directives', C.Directive.View),
      item('Office workload', 'lucideChartNoAxesCombined', 'workload', C.Directive.View),
      item('Decision audit trail', 'lucideHistory', 'audit-trail', undefined, [C.Audit.View, C.Directive.View]),
    ] }],
  },
  {
    key: 'human-resources',
    label: 'Human Resources',
    summary: 'People, personnel files, establishment, leave, appointments and promotions.',
    landingRoute: 'overview',
    accessCapabilities: [C.Staff.View, C.Staff.Create, C.Staff.Activate],
    navigation: [personal, { label: 'People operations', items: [
      item('Staff registry', 'lucideUsers', 'staff', C.Staff.View),
      item('Pending activations', 'lucideUserCheck', 'staff-activation', C.Staff.Activate),
      item('Personnel files', 'lucideFiles', 'personnel-files', C.Staff.View),
      item('Leave management', 'lucideCalendarCheck', 'leave', C.Staff.Update),
      item('Appointments & promotions', 'lucideAward', 'appointments', C.Staff.Update),
      item('Establishment', 'lucideBriefcaseBusiness', 'establishment', C.Staff.Create),
      item('HR reports', 'lucideChartNoAxesCombined', 'reports', C.Staff.View),
    ] }],
  },
  {
    key: 'system-administration',
    label: 'System Administration',
    summary: 'Organisation structure, access control, policies, integrations and platform configuration.',
    landingRoute: 'overview',
    accessCapabilities: [C.System.Configure],
    navigation: [personal, { label: 'Platform administration', items: [
      item('Organisation structure', 'lucideNetwork', 'organization', C.System.Configure),
      item('Roles & capabilities', 'lucideShieldCheck', 'access', C.System.Configure),
      item('Document configuration', 'lucideFileCog', 'document-configuration', C.System.Configure),
      item('Workflow configuration', 'lucideWorkflow', 'workflow-configuration', C.System.Configure),
      item('Retention policies', 'lucideCalendarClock', 'retention-configuration', C.System.Configure),
      item('Integrations', 'lucidePlugZap', 'integrations', C.System.Configure),
      item('System audit', 'lucideHistory', 'system-audit', C.System.Configure),
    ] }],
  },
  {
    key: 'audit-compliance',
    label: 'Audit & Compliance',
    summary: 'Independent, primarily read-only oversight of documents, access and lifecycle controls.',
    landingRoute: 'overview',
    accessCapabilities: [C.Audit.View],
    navigation: [personal, { label: 'Assurance', items: [
      item('Document audit', 'lucideFileSearch', 'document-audit', C.Audit.View),
      item('Workflow audit', 'lucideWorkflow', 'workflow-audit', C.Audit.View),
      item('Access audit', 'lucideShieldCheck', 'access-audit', C.Audit.View),
      item('Retention review', 'lucideCalendarClock', 'retention-review', C.Audit.View),
      item('Disposition review', 'lucideArchiveRestore', 'disposition-review', C.Audit.View),
      item('Compliance reports', 'lucideChartNoAxesCombined', 'reports', C.Audit.View),
    ] }],
  },
];

@Injectable({ providedIn: 'root' })
export class WorkbenchRegistry {
  private readonly definitions = new Map(definitions.map((definition) => [definition.key, definition]));

  get(key: OfficeWorkbenchKey): OfficeWorkbenchDefinition {
    const definition = this.definitions.get(key);
    if (!definition) throw new Error(`Unknown office workbench: ${key}`);
    return definition;
  }

  all(): OfficeWorkbenchDefinition[] {
    return [...this.definitions.values()];
  }
}
