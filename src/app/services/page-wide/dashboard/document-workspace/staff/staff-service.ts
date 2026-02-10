import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { environment } from '../../../../../../environments/environment.development';
import { DepartmentCategory } from '../../../../../interfaces/departments/Department.entity';
import { DepartmentsUi } from '../../../../../interfaces/departments/Department.ui';
import { DocumentVolumeUi } from '../../../../../interfaces/documents/volumes/DocumentVolume.ui';
import { Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { SignaturePlaceHolderForBaseLevelAuthorityUi } from '../../../../../interfaces/workspace/signature/signature.ui';

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  private http = inject(HttpClient);

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

//   signaturePlaceholder !: WritableSignal<SignaturePlaceHolderForBaseLevelAuthorityUi>
signaturePlaceholder = signal<SignaturePlaceHolderForBaseLevelAuthorityUi>({
    id: 'akhskash',
    format: '__signature__'
})
  async getDepartments() {
    return this.http.get(`${environment.api}/departments`);
  }

  async getSignature(id: string) {}

  async getSignaturePlaceholder() {
    const data = this.http.get(
      `${environment.api}/signature/placeholder`,
    ) as Observable<SignaturePlaceHolderForBaseLevelAuthorityUi>;

    const signalData = toSignal(data)
    if(signalData()) this.signaturePlaceholder.set(signalData()!)
  }
}
