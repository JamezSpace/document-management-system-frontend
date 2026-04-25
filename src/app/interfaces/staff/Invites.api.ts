import { InviteStatus } from '../../enum/invite/status.enum';
import { EmploymentType } from '../../enum/staff/employmentType.enum';
import { BaseStaffEntity } from './BaseStaff.api';

interface InvitesApi {
  id: string;
  email: string;
  unit: {
    id: string;
    name: string;
    sector: string;
  };
  office: {
    id: string;
    name: string;
  };
  designation: {
    id: string;
    title: string;
  };
  employmentType: EmploymentType;
  invitedBy: {
		id: string;
		staffNumber: number;
        fullName: string;
		unit: {
			id: string;
			name: string;
			sector: string;
		};
		office: {
			id: string;
			name: string;
		};
		designation: {
			id: string;
			title: string;
		};
	};
  token: string;
  isUsed: boolean;
  expiresAt: string;
  acceptedAt: string | null;
  rejectedAt: string | null;
  status: InviteStatus;
  createdAt: string;
  updatedAt: string | null;
}

export type { InvitesApi };
