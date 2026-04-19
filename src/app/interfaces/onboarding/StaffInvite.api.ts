import { InviteStatus } from "../../enum/invite/status.enum";
import { EmploymentType } from "../../enum/staff/employmentType.enum";

interface StaffInvite {
    id: string;
	email: string;
	unitId: string;
	officeId: string;
	designationId: string;
	employmentType: EmploymentType;
	invitedBy: string;
    token: string;
    expiresAt: Date;
    acceptedAt: Date | null;
    rejectedAt: Date | null;
    status: InviteStatus;
    createdAt: Date;
    updatedAt?: Date | null;
}

export type {StaffInvite};