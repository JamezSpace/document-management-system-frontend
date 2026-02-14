import { inject, Injectable, signal } from '@angular/core';
import { Delta } from 'quill';
import { DepartmentCategory } from '../../../../interfaces/departments/Department.entity';
import { DocumentVolumeUi } from '../../../../interfaces/documents/volumes/DocumentVolume.ui';
import { DepartmentsUi } from '../../../../interfaces/departments/Department.ui';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { OfficeMember } from '../../../../interfaces/users/office/office-member/OfficeMember.api';

@Injectable({
  providedIn: 'root',
})
// this service serves things common to the document initiator (e.g. StaffDocuments.html), workspace and editor in the workspace
export class GenericDashboardService {
  private http = inject(HttpClient);

  loading = signal<boolean>(false);

  quillEditorContent = signal<{
    deltaContent: Delta | null;
    textContent: string;
    htmlContent: string;
  }>({
    deltaContent: null,
    textContent: '',
    htmlContent: '',
  });

  departments = signal<DepartmentsUi[]>([
    {
      id: 'CSC',
      name: 'Computer Science',
      label: 'Department of Computer Science',
      category: DepartmentCategory.ACADEMIC,
      deptHead: 'Prof. Adeyemi O. S.',
    },
    {
      id: 'ITCC',
      name: 'ITCC',
      label: 'Information Technology & Media Services',
      category: DepartmentCategory.NON_ACADEMIC,
      deptHead: 'Dr. Bakare A. W.',
    },
    {
      id: 'BUR',
      name: 'Bursary',
      label: 'University Bursary Department',
      category: DepartmentCategory.NON_ACADEMIC,
      deptHead: 'Mr. Adewole O. P.',
    },
    {
      id: 'LAW',
      name: 'Public Law',
      label: 'Department of Public Law',
      category: DepartmentCategory.ACADEMIC,
      deptHead: 'Prof. Oluyode J. K.',
    },
    {
      id: 'REG',
      name: 'Registry',
      label: 'The University Registry',
      category: DepartmentCategory.NON_ACADEMIC,
      deptHead: 'Mrs. Olujimi F. M.',
    },
    {
      id: 'MEE',
      name: 'Mechanical Engineering',
      label: 'Department of Mechanical Engineering',
      category: DepartmentCategory.ACADEMIC,
      deptHead: 'Dr. Oke O. T.',
    },
    {
      id: 'HIS',
      name: 'History',
      label: 'Department of History',
      category: DepartmentCategory.ACADEMIC,
      deptHead: 'Prof. Balogun R. A.',
    },
    {
      id: 'UHS',
      name: 'Health Services',
      label: 'University Health Service (Jaja)',
      category: DepartmentCategory.NON_ACADEMIC,
      deptHead: 'Dr. Ayoola S. B.',
    },
    {
      id: 'ECO',
      name: 'Economics',
      label: 'Department of Economics',
      category: DepartmentCategory.ACADEMIC,
      deptHead: 'Dr. Sanusi L. E.',
    },
    {
      id: 'EST',
      name: 'Estate Management',
      label: 'Directorate of Estate Management',
      category: DepartmentCategory.NON_ACADEMIC,
      deptHead: 'Engr. Ogunlana D. V.',
    },
  ]);

  correspondenceVolumes = signal<DocumentVolumeUi[]>([
    {
      code: 'exec',
      name: 'Executive Governance',
    },
    {
      code: 'pers',
      name: 'Personnel & Registry',
    },
    {
      code: 'fin',
      name: 'Financial Records',
    },
    {
      code: 'acad',
      name: 'Academic Affairs',
    },
    {
      code: 'strat',
      name: 'Strategic Planning',
    },
  ]);

  officeMembers = signal<OfficeMember[]>([
    {
      id: 'OM-001',
      fullName: 'Alice Henderson',
      email: 'a.henderson@company.com',
      unit: 'Product Design',
    },
    {
      id: 'OM-002',
      fullName: 'Marcus Thorne',
      email: 'm.thorne@company.com',
      unit: 'Engineering',
    },
    {
      id: 'OM-003',
      fullName: 'Elena Rodriguez',
      email: 'e.rodriguez@company.com',
      unit: 'Marketing',
    },
    {
      id: 'OM-004',
      fullName: 'Jordan Smith',
      email: 'j.smith@company.com',
      unit: 'Human Resources',
    },
    {
      id: 'OM-005',
      fullName: 'Sarah Jenkins',
      email: 's.jenkins@company.com',
      unit: 'Finance',
    },
    {
      id: 'OM-006',
      fullName: 'David Chen',
      email: 'd.chen@company.com',
      unit: 'Engineering',
    },
    {
      id: 'OM-007',
      fullName: 'Amara Okafor',
      email: 'a.okafor@company.com',
      unit: 'Legal',
    },
    {
      id: 'OM-008',
      fullName: 'Leo Vance',
      email: 'l.vance@company.com',
      unit: 'Customer Success',
    },
    {
      id: 'OM-009',
      fullName: 'Sophie Muller',
      email: 's.muller@company.com',
      unit: 'Operations',
    },
    {
      id: 'OM-010',
      fullName: 'Victor Grant',
      email: 'v.grant@company.com',
      unit: 'Sales',
    },
  ]);

  async getDepartments() {
    return this.http.get(`${environment.api}/departments`);
  }
}
