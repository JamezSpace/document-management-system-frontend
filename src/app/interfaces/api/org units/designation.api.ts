interface DesignationApi {
  id: string;
  title: string;
  description?: string | undefined;
  officeId: string;
  createdAt?: Date;
  updatedAt?: Date | undefined;
}

const emptyDesignation: DesignationApi = {
    id: '',
    officeId: '',
    title: ''
}

export { type DesignationApi, emptyDesignation };
