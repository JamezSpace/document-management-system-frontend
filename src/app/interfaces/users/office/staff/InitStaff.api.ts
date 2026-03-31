import { EmploymentType } from "../../../../enum/staff/employmentType.enum"

interface InitStaffPayload {
    firstName: string,
	lastName: string,
	middleName: string,
	email: string,
	phoneNumber: string,

	staffNumber: number,
	employmentType: EmploymentType,
	unitId: string,
	officeId: string,
	designationId: string,

    createdBy: string
}

export type {InitStaffPayload}