import { Component, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEye, lucideFileLock2, lucideFilter, lucideLockKeyhole, lucideSearch, lucideShieldCheck } from '@ng-icons/lucide';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { HlmTableImports } from '@spartan-ng/helm/table';
import type { PersonnelRecord } from '../../../../models/ui/human-resources/PersonnelRecord.ui';
import { OfficeContextService } from '../../../../office-platform/context/office-context.service';

const personnel: Record<string, PersonnelRecord> = {
  'staff-0297': {
    id: 'staff-0297', staffNumber: 'UI/0297', name: 'Dr. Tola Okafor', designation: 'Principal Planning Officer', office: 'Academic Planning', appointment: 'Permanent · Grade 13', employmentStatus: 'Active', classification: 'Restricted personnel data', hold: 'No active hold',
    timeline: ['Appointed Assistant Planning Officer · 2017', 'Promoted to Senior Planning Officer · 2021', 'Promoted to Principal Planning Officer · 2025'],
    documents: ['Appointment letter', 'Promotion instrument · 2025', 'Annual performance record · 2025'],
    accessHistory: ['Viewed by HR Records Officer · 31 Aug 2026, 09:42', 'Promotion instrument added by Appointments Unit · 4 Jul 2025'],
  },
  'staff-0418': {
    id: 'staff-0418', staffNumber: 'UI/0418', name: 'Amina Balogun', designation: 'Senior Executive Officer', office: 'Secretariat', appointment: 'Permanent · Grade 10', employmentStatus: 'Active · promotion case open', classification: 'Restricted personnel data', hold: 'Promotion evidence hold',
    timeline: ['Appointed Executive Officer II · 2018', 'Confirmed in appointment · 2020', 'Promoted to Senior Executive Officer · 2023'],
    documents: ['Appointment letter', 'Confirmation instrument', 'Promotion evidence bundle · 2026'],
    accessHistory: ['Opened for promotion review by Appointments Officer · 30 Aug 2026', 'Evidence hold applied by HR Records Officer · 30 Aug 2026'],
  },
};

@Component({
  selector: 'nexus-personnel-files',
  imports: [NgIcon, HlmBreadCrumbImports, HlmButtonImports, HlmInput, HlmSeparator, HlmSheetImports, HlmTableImports],
  templateUrl: './personnel-files.html',
  providers: [provideIcons({ lucideEye, lucideFileLock2, lucideFilter, lucideLockKeyhole, lucideSearch, lucideShieldCheck })],
})
class PersonnelFiles {
  readonly officeContext = inject(OfficeContextService);
  readonly selectedPerson = signal<PersonnelRecord>(personnel['staff-0297']);

  selectPerson(id: string): void {
    this.selectedPerson.set(personnel[id] ?? personnel['staff-0297']);
  }
}

export { PersonnelFiles };
