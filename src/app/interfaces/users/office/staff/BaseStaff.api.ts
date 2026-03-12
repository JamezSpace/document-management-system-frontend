interface BaseStaffEntity {
  id: string;
  identityId: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  staffNumber: number;
  employmentType: string;
  unitSector: string;
  unitName: string;
  office: string;
  designation: string | null;
  status: string;
  createdAt: string;
  updatedAt: string | null;
}

export type { BaseStaffEntity };
