import { Injectable, signal } from '@angular/core';
import type { RecordDetail } from '../../../../models/ui/records/RecordDetail.ui';

const recordDetails: Record<string, RecordDetail> = {
  'NF/REG/2026/0841': {
    reference: 'NF/REG/2026/0841',
    title: 'Industrial attachment policy review',
    classification: 'Academic administration · Student services',
    sensitivity: 'Internal',
    custodian: 'Records & Registry',
    status: 'Routing',
    retention: 'ADM-07 · 7 years after closure',
    activity: ['Captured from secure email', 'Quality check passed', 'Registered by Registry Officer', 'Routed to Industrial Office'],
  },
  'NF/REG/2026/0837': {
    reference: 'NF/REG/2026/0837',
    title: 'Procurement evaluation report',
    classification: 'Finance · Procurement',
    sensitivity: 'Confidential',
    custodian: 'Procurement Office',
    status: 'Acknowledged',
    retention: 'FIN-12 · 10 years after contract close',
    activity: ['Registered at central registry', 'Confidential access policy applied', 'Acknowledged by Procurement Office'],
  },
  'NF/OUT/2026/0312': {
    reference: 'NF/OUT/2026/0312',
    title: 'Appointment confirmation notice',
    classification: 'Human resources · Appointments',
    sensitivity: 'Internal',
    custodian: 'Human Resources',
    status: 'Awaiting authorization',
    retention: 'HR-04 · Permanent personnel record',
    activity: ['Draft received from Human Resources', 'Dispatch metadata registered', 'Authorization requested'],
  },
};

@Injectable({ providedIn: 'root' })
class RecordsService {
  readonly selectedRecord = signal<RecordDetail>(recordDetails['NF/REG/2026/0841']);

  selectRecord(reference: string): void {
    this.selectedRecord.set(recordDetails[reference] ?? recordDetails['NF/REG/2026/0841']);
  }
}

export { RecordsService };
