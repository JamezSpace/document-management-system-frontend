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
  details: any;
}

export { EntityType};
export type { EntityRequest, EntityResponse };