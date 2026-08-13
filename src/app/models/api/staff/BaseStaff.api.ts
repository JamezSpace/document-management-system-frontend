import type { OfficeWorkbenchKey } from '../../../office-platform/models/office-workbench';

interface BaseStaffEntity {
  id: string;
  identityId: string;
  firstName: string;
  lastName: string;
  middleName: string;
  fullName: string;
  email: string;
  staffNumber: number;
  employmentType: string;
  unit: {
    sector: string;
    name: string;
    id: string;
  };
  office: {
    id: string;
    name: string;
    workbench?: OfficeWorkbenchKey;
  };
  designation: {
    id: string;
    title: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string | null;
}

export type { BaseStaffEntity };

