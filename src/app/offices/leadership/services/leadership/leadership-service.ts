import { computed, Injectable, signal } from '@angular/core';
import type { AuthorityAction } from '../../../../models/ui/governance/AuthorityAction.ui';
import type { LeadershipDecision } from '../../../../models/ui/leadership/LeadershipDecision.ui';
import type {
  LeadershipAuditEvent,
  LeadershipDirectiveSummary,
  LeadershipEscalation,
  LeadershipMetric,
  LeadershipRisk,
  LeadershipWorkloadRow,
} from '../../../../models/ui/leadership/LeadershipWorkspace.ui';

@Injectable({ providedIn: 'root' })
export class LeadershipService {
  readonly metrics: readonly LeadershipMetric[] = [
    { label: 'Pending decisions', value: '9', note: '3 due today', icon: 'lucideGavel', tone: 'text-primary' },
    { label: 'Signatures', value: '6', note: 'All version-verified', icon: 'lucidePenTool', tone: 'text-(--brand-authority-accent)' },
    { label: 'Escalations', value: '5', note: '2 authority-required', icon: 'lucideTriangleAlert', tone: 'text-(--brand-warning)' },
    { label: 'Unit SLA risk', value: '7', note: 'Across 4 workstreams', icon: 'lucideAlarmClock', tone: 'text-(--brand-error)' },
    { label: 'Recent directives', value: '4', note: '3 acknowledged', icon: 'lucideZap', tone: 'text-primary' },
  ];

  readonly decisions: readonly LeadershipDecision[] = [
    {
      id: 'lead-0198',
      kind: 'approval',
      reference: 'NF/REG/2026/0841',
      title: 'Industrial attachment policy implementation',
      decision: 'Approve the proposed implementation timetable',
      requester: 'Director, Academic Planning',
      authority: 'Vice-Chancellor',
      deadline: 'Today · 15:00',
      version: 'v4 · approved for decision',
      classification: 'Internal · Academic governance',
      effect: 'Approval authorizes the timetable and creates accountable implementation actions for the named offices.',
      authorship: 'Academic Planning Team · Lead author: Dr. T. Okafor',
      approvals: ['Legal review complete', 'Registrar concurrence recorded', 'Records version check passed'],
      activity: ['Submitted for leadership decision', 'Policy compatibility verified', 'Briefing completed by Secretariat'],
    },
    {
      id: 'lead-0194',
      kind: 'signature',
      reference: 'NF/OUT/2026/0312',
      title: 'Appointment confirmation instrument',
      decision: 'Sign the approved appointment instrument',
      requester: 'Registrar',
      authority: 'Vice-Chancellor',
      deadline: 'Today · 16:30',
      version: 'v4 · hash verified',
      classification: 'Confidential · Human resources',
      effect: 'Signature gives legal effect to the appointment from 1 September 2026.',
      authorship: 'Human Resources · Verified by Registrar',
      approvals: ['HR approval complete', 'Legal review complete', 'Registrar approval complete'],
      activity: ['Instrument drafted', 'Appointment authority verified', 'Submitted for signature'],
    },
    {
      id: 'lead-0187',
      kind: 'escalation',
      reference: 'NF/REG/2026/0837',
      title: 'Procurement evaluation exception',
      decision: 'Resolve an unresolved evaluation rejection',
      requester: 'Head, Procurement Office',
      authority: 'Chief Accounting Officer',
      deadline: 'Breached · 2h 18m',
      version: 'v5 · escalated',
      classification: 'Confidential · Procurement',
      effect: 'The decision determines whether the evaluation returns for correction or proceeds under a documented exception.',
      authorship: 'Procurement Evaluation Committee',
      approvals: ['Technical evaluation recorded', 'Compliance objection unresolved'],
      activity: ['Evaluation submitted', 'Compliance rejection recorded', 'Escalated after SLA breach'],
    },
  ];
  readonly signatureDecisions = this.decisions.filter((decision) => decision.kind === 'signature');

  readonly risks: readonly LeadershipRisk[] = [
    { stream: 'Procurement review', state: '2 breached', tone: 'text-(--brand-error)' },
    { stream: 'Accreditation readiness', state: '3 at risk', tone: 'text-(--brand-warning)' },
    { stream: 'Appointment instruments', state: '2 due today', tone: 'text-(--brand-warning)' },
  ];

  readonly recentDirectives: readonly LeadershipDirectiveSummary[] = [
    { title: 'Weekly readiness reporting', status: 'Acknowledgement recorded' },
    { title: 'Procurement exception review', status: 'Acknowledgement recorded' },
    { title: 'Dispatch evidence reconciliation', status: 'Acknowledgement recorded' },
  ];

  readonly escalationGroups = ['Authority required', 'Overdue', 'Policy conflict', 'Unresolved rejection', 'Capacity constraint'] as const;
  readonly escalations: readonly LeadershipEscalation[] = [
    { id: 'lead-0187', urgency: 'Immediate', cause: 'Unresolved rejection', title: 'Procurement evaluation exception', owner: 'Head, Procurement Office', age: 'Breached 2h 18m', authority: 'Chief Accounting Officer', request: 'Decide correction or documented exception' },
    { id: 'lead-0198', urgency: 'Today', cause: 'Authority required', title: 'Industrial attachment policy implementation', owner: 'Director, Academic Planning', age: 'Due 15:00', authority: 'Vice-Chancellor', request: 'Approve or return the implementation timetable' },
    { id: 'lead-0194', urgency: 'Today', cause: 'Capacity constraint', title: 'Appointment instrument backlog', owner: 'Secretariat', age: '6 instruments waiting', authority: 'Vice-Chancellor', request: 'Confirm sign-off sequence or delegate within policy' },
  ];

  readonly workload: readonly LeadershipWorkloadRow[] = [
    { id: 'staff-01', name: 'A. Balogun', role: 'Senior Executive Officer', availability: 'Available · 60%', activeAssignments: 8, overdue: 1, upcomingDeadlines: '3 within 48h', capacityContext: 'Can accept one standard assignment' },
    { id: 'staff-02', name: 'T. Okafor', role: 'Principal Planning Officer', availability: 'Focused work · 25%', activeAssignments: 11, overdue: 2, upcomingDeadlines: '5 within 48h', capacityContext: 'Do not assign without reprioritization' },
    { id: 'stream-01', name: 'Accreditation readiness', role: 'Cross-office workstream', availability: 'At risk', activeAssignments: 19, overdue: 3, upcomingDeadlines: '7 within 72h', capacityContext: 'Needs two reviewers and Secretariat support' },
    { id: 'staff-03', name: 'M. Yusuf', role: 'Registry Liaison', availability: 'On leave until 2 Sep', activeAssignments: 3, overdue: 0, upcomingDeadlines: '1 within 7d', capacityContext: 'Assignments covered by A. Balogun' },
  ];

  readonly auditEvents: readonly LeadershipAuditEvent[] = [
    { id: 'DEC-2026-0918', occurredAt: '29 Aug · 10:42:18', decision: 'Approved implementation timetable', authority: 'Vice-Chancellor', object: 'NF/REG/2026/0841 · v4', rationale: 'Readiness evidence and accountable owners confirmed', outcome: 'Approved', lifecycleChange: 'Pending decision → Implementation authorized' },
    { id: 'DEC-2026-0914', occurredAt: '29 Aug · 09:58:03', decision: 'Rejected procurement exception', authority: 'Chief Accounting Officer', object: 'NF/REG/2026/0837 · v4', rationale: 'Mandatory declarations absent; exception not justified', outcome: 'Rejected', lifecycleChange: 'Escalated → Returned for correction' },
    { id: 'DEC-2026-0907', occurredAt: '28 Aug · 16:30:44', decision: 'Signed appointment instrument', authority: 'Vice-Chancellor', object: 'NF/OUT/2026/0312 · v4', rationale: 'Appointment and delegation evidence verified', outcome: 'Signed', lifecycleChange: 'Approved → Signed and effective' },
  ];

  readonly selectedDecision = signal<LeadershipDecision>(this.decisions[0]);
  readonly escalationGroup = signal<string>('Authority required');
  readonly filteredEscalations = computed(() =>
    this.escalations.filter((escalation) => escalation.cause === this.escalationGroup()),
  );
  readonly authorityAction = signal<AuthorityAction>(this.approvalAction(this.decisions[0]));

  selectDecision(id: string): void {
    this.selectedDecision.set(this.decisions.find((decision) => decision.id === id) ?? this.decisions[0]);
  }

  selectEscalationGroup(group: string): void {
    this.escalationGroup.set(group);
  }

  prepareApproval(): void {
    this.authorityAction.set(this.approvalAction(this.selectedDecision()));
  }

  prepareRejection(): void {
    const selected = this.selectedDecision();
    this.authorityAction.set({
      title: 'Reject and return decision object',
      currentState: 'Pending accountable decision',
      proposedState: 'Rejected · returned with rationale',
      authority: `${selected.authority} acting within the effective authority scope`,
      consequence: 'The object returns to the responsible office. The rationale remains visible until a corrected version is resubmitted.',
      reversible: 'A corrected version may be submitted as a new decision event.',
      evidence: 'Authority role, rejection rationale, exact version, timestamp and return instruction.',
      confirmLabel: 'Reject with rationale',
      reject: true,
    });
  }

  private approvalAction(selected: LeadershipDecision): AuthorityAction {
    const signing = selected.kind === 'signature';
    return {
      title: signing ? 'Sign authoritative document' : 'Approve leadership decision',
      currentState: signing ? 'Approved · awaiting signature' : 'Pending accountable decision',
      proposedState: signing ? 'Signed · legally effective' : 'Approved · implementation authorized',
      authority: `${selected.authority} acting within the effective authority scope`,
      consequence: selected.effect,
      reversible: 'Only through a recorded superseding, corrective or revocation decision.',
      evidence: 'Authority role, rationale, exact version, classification, timestamp and resulting lifecycle transition.',
      confirmLabel: signing ? 'Sign exact version' : 'Approve decision',
    };
  }
}
