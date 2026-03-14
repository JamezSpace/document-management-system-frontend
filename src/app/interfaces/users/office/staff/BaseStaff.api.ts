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
  };
  designation: {
    id: string;
    title: string;
  } | null;
  status: string;
  createdAt: string;
  updatedAt: string | null;
}

export type { BaseStaffEntity };

