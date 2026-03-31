import { BaseStaffEntity } from "../../users/office/staff/BaseStaff.api";

enum EntityType {
  STAFF = 'staff',
  DEPARTMENT = 'department',
}

interface EntityRequest {
  id: string;
  type: EntityType;
}

interface EntityResponse {
  type: EntityType;
  details: BaseStaffEntity;
}

export { EntityType};
export type { EntityRequest, EntityResponse };