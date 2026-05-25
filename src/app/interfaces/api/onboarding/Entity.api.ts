enum EntityType {
  STAFF = 'staff',
  DEPARTMENT = 'department',
}

interface EntityRequest {
  id: string;
  type: EntityType;
}

interface EntityResponse<T> {
  type: EntityType;
  details: T;
}

export { EntityType };
export type { EntityRequest, EntityResponse };

