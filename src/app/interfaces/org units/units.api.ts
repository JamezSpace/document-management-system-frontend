interface UnitsApi {
  id: string;
  code: string;
  fullName: string;
  description: string;
  sector: string;
  parentId: string;
  createdAt: Date;
  updatedAt?: Date | null;
  subunits: UnitsApi[];
}

export type { UnitsApi };
