import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Delta } from 'quill';
import { environment } from '../../../../../environments/environment.development';
import { BussFunctionApi } from '../../../../interfaces/documents/bussFunction/bussFunction.api';
import { CorrSubjectApi } from '../../../../interfaces/documents/corrSubject/corrSubject.api';
import { DocTypeApi } from '../../../../interfaces/documents/docType/docType.api';
import { DepartmentsUi } from '../../../../interfaces/org units/Department.ui';
import { OrgUnitCategory } from '../../../../enum/identity/unitCategory.enum';

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
      category: OrgUnitCategory.ACADEMIC,
      deptHead: 'Prof. Adeyemi O. S.',
    },
    {
      id: 'ITCC',
      name: 'ITCC',
      label: 'Information Technology & Media Services',
      category: OrgUnitCategory.NON_ACADEMIC,
      deptHead: 'Dr. Bakare A. W.',
    },
    {
      id: 'BUR',
      name: 'Bursary',
      label: 'University Bursary Department',
      category: OrgUnitCategory.NON_ACADEMIC,
      deptHead: 'Mr. Adewole O. P.',
    },
    {
      id: 'LAW',
      name: 'Public Law',
      label: 'Department of Public Law',
      category: OrgUnitCategory.ACADEMIC,
      deptHead: 'Prof. Oluyode J. K.',
    },
    {
      id: 'REG',
      name: 'Registry',
      label: 'The University Registry',
      category: OrgUnitCategory.NON_ACADEMIC,
      deptHead: 'Mrs. Olujimi F. M.',
    },
    {
      id: 'MEE',
      name: 'Mechanical Engineering',
      label: 'Department of Mechanical Engineering',
      category: OrgUnitCategory.ACADEMIC,
      deptHead: 'Dr. Oke O. T.',
    },
    {
      id: 'HIS',
      name: 'History',
      label: 'Department of History',
      category: OrgUnitCategory.ACADEMIC,
      deptHead: 'Prof. Balogun R. A.',
    },
    {
      id: 'UHS',
      name: 'Health Services',
      label: 'University Health Service (Jaja)',
      category: OrgUnitCategory.NON_ACADEMIC,
      deptHead: 'Dr. Ayoola S. B.',
    },
    {
      id: 'ECO',
      name: 'Economics',
      label: 'Department of Economics',
      category: OrgUnitCategory.ACADEMIC,
      deptHead: 'Dr. Sanusi L. E.',
    },
    {
      id: 'EST',
      name: 'Estate Management',
      label: 'Directorate of Estate Management',
      category: OrgUnitCategory.NON_ACADEMIC,
      deptHead: 'Engr. Ogunlana D. V.',
    },
  ]);

  correspondencSubjects = signal<CorrSubjectApi[]>([]);
  businessFunctions = signal<BussFunctionApi[]>([])
  documentTypes = signal<DocTypeApi[]>([])

  async getDepartments() {
    return this.http.get(`${environment.api}/departments`);
  }

}
