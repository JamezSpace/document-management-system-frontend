import { Injectable, signal } from '@angular/core';
import { DirectiveApi } from '../../../../../../interfaces/operations/cio/Directive.api';
import { DirectiveUi } from '../../../../../../interfaces/operations/cio/Directive.ui';
import { DirectiveDetailApi } from '../../../../../../interfaces/operations/cio/DirectiveDetail.api';
import { StaffLoginApi } from '../../../../../../interfaces/users/office/staff/StaffLogin.api';

@Injectable({
  providedIn: 'root',
})
export class DirectivesService {
  directives = signal<DirectiveUi[]>([
    {
      id: 'DIR-001',
      heading: 'Annual Code of Conduct Review',
      recipients: [],
      compliance: { seen: 142, acknowledged: 128 },
      modifiedAt: '2026-01-15T09:00:00Z',
    },
    {
      id: 'DIR-002',
      heading: 'Updated Remote Work Eligibility',
      recipients: [],
      compliance: { seen: 89, acknowledged: 85 },
      modifiedAt: '2026-01-20T14:30:00Z',
    },
    {
      id: 'DIR-003',
      heading: 'Mandatory Unconscious Bias Training',
      recipients: [],
      compliance: { seen: 210, acknowledged: 150 },
      modifiedAt: '2026-02-01T10:15:00Z',
    },
    {
      id: 'DIR-004',
      heading: 'Q3 Performance Review Timeline',
      recipients: [],
      compliance: { seen: 56, acknowledged: 56 },
      modifiedAt: '2026-02-05T08:45:00Z',
    },
    {
      id: 'DIR-005',
      heading: 'New Employee Referral Bonus Program',
      recipients: [],
      compliance: { seen: 45, acknowledged: 30 },
      modifiedAt: '2026-02-10T11:00:00Z',
    },
    {
      id: 'DIR-006',
      heading: 'Open Enrollment: Health Benefits 2026',
      recipients: [],
      compliance: { seen: 300, acknowledged: 285 },
      modifiedAt: '2026-02-12T16:20:00Z',
    },
    {
      id: 'DIR-007',
      heading: 'Mandatory Multi-Factor Auth Reset',
      recipients: [],
      compliance: { seen: 115, acknowledged: 110 },
      modifiedAt: '2026-02-14T09:10:00Z',
    },
    {
      id: 'DIR-008',
      heading: 'Clean Desk Policy & Hardware Storage',
      recipients: [],
      compliance: { seen: 42, acknowledged: 38 },
      modifiedAt: '2026-02-15T13:00:00Z',
    },
    {
      id: 'DIR-009',
      heading: 'Reporting Phishing: New Protocol',
      recipients: [],
      compliance: { seen: 204, acknowledged: 190 },
      modifiedAt: '2026-02-16T10:00:00Z',
    },
    {
      id: 'DIR-010',
      heading: 'Critical Security Patch: Windows v24.2',
      recipients: [],
      compliance: { seen: 88, acknowledged: 88 },
      modifiedAt: '2026-02-18T07:30:00Z',
    },
    {
      id: 'DIR-011',
      heading: 'Personal Device Usage (BYOD) Update',
      recipients: [],
      compliance: { seen: 72, acknowledged: 65 },
      modifiedAt: '2026-02-19T15:45:00Z',
    },
    {
      id: 'DIR-012',
      heading: 'Cloud Storage Migration Deadline',
      recipients: [],
      compliance: { seen: 50, acknowledged: 42 },
      modifiedAt: '2026-02-20T12:00:00Z',
    },
    {
      id: 'DIR-013',
      heading: 'Emergency Evacuation Drill - March 15',
      recipients: [],
      compliance: { seen: 312, acknowledged: 312 },
      modifiedAt: '2026-02-21T09:00:00Z',
    },
    {
      id: 'DIR-014',
      heading: 'Office Parking Permit Renewal',
      recipients: [],
      compliance: { seen: 95, acknowledged: 80 },
      modifiedAt: '2026-02-22T14:15:00Z',
    },
    {
      id: 'DIR-015',
      heading: 'Visitor Access & Badge Requirements',
      recipients: [],
      compliance: { seen: 28, acknowledged: 28 },
      modifiedAt: '2026-02-23T08:20:00Z',
    },
    {
      id: 'DIR-016',
      heading: 'New Sustainability & Recycling Guidelines',
      recipients: [],
      compliance: { seen: 120, acknowledged: 95 },
      modifiedAt: '2026-02-24T11:10:00Z',
    },
    {
      id: 'DIR-017',
      heading: 'After-Hours Building Access Protocol',
      recipients: [],
      compliance: { seen: 34, acknowledged: 30 },
      modifiedAt: '2026-02-25T16:40:00Z',
    },
    {
      id: 'DIR-018',
      heading: 'Shared Workspace Booking Rules',
      recipients: [],
      compliance: { seen: 66, acknowledged: 60 },
      modifiedAt: '2026-02-26T10:50:00Z',
    },
    {
      id: 'DIR-019',
      heading: 'Anti-Bribery and Corruption Policy',
      recipients: [],
      compliance: { seen: 150, acknowledged: 148 },
      modifiedAt: '2026-02-27T09:30:00Z',
    },
    {
      id: 'DIR-020',
      heading: 'Updated Travel Expense Reimbursement',
      recipients: [],
      compliance: { seen: 110, acknowledged: 105 },
      modifiedAt: '2026-02-27T14:00:00Z',
    },
    {
      id: 'DIR-021',
      heading: 'GDPR & Data Privacy Compliance',
      recipients: [],
      compliance: { seen: 225, acknowledged: 210 },
      modifiedAt: '2026-02-28T08:00:00Z',
    },
    {
      id: 'DIR-022',
      heading: 'Quarterly Budget Submission Deadline',
      recipients: [],
      compliance: { seen: 15, acknowledged: 15 },
      modifiedAt: '2026-03-01T11:20:00Z',
    },
    {
      id: 'DIR-023',
      heading: 'Insider Trading Awareness Notice',
      recipients: [],
      compliance: { seen: 85, acknowledged: 82 },
      modifiedAt: '2026-03-02T13:45:00Z',
    },
    {
      id: 'DIR-024',
      heading: 'Vendor Procurement Update',
      recipients: [],
      compliance: { seen: 40, acknowledged: 35 },
      modifiedAt: '2026-03-03T09:00:00Z',
    },
  ]);
  directiveDetail = signal<DirectiveDetailApi | null>(null)
  unitStaffers = signal<StaffLoginApi[]>([])

  private convertApiForUiUse(directivesApi: DirectiveApi[]): DirectiveUi[] {
    const directivesUi = directivesApi.map((directive) => {
      const compliance = {
        seen: directive.seenCount,
        acknowledged: directive.acknowledgementCount,
      };

      const { seenCount, acknowledgementCount, modifiedAt, ...filtered } = directive;

      let modifiedAtAsString = new Date(modifiedAt).toLocaleString();

      return {
        compliance,
        modifiedAt: modifiedAtAsString,
        ...filtered,
      };
    });

    return directivesUi;
  }

  async fetchAllDirectives() {}
  async fetchDirectiveById(directiveId: string) {}
}
