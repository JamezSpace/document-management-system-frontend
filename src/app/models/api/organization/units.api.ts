interface UnitsApi {
  id: '';
  code: string;
  fullName: string;
  description: string;
  sector: string;
  parentId: string;
  createdAt: Date;
  updatedAt?: Date | null;
  subunits: UnitsApi[];
}

const emptyUnit: UnitsApi = {
  id: '',
  code: '',
  fullName: '',
  description: '',
  sector: '',
  parentId: '',
  createdAt: new Date(),
  subunits: []
};

export { type UnitsApi, emptyUnit };
