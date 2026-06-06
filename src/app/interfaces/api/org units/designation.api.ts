interface DesignationApi {
  id: string;
  title: string;
  description?: string | undefined;
  hierarchyLevel: number;
  officeId: string;
  createdAt?: Date;
  updatedAt?: Date | undefined;
}

const emptyDesignation: DesignationApi = {
    hierarchyLevel: 0,
    id: '',
    officeId: '',
    title: ''
}

export { type DesignationApi, emptyDesignation };
