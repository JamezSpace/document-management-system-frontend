import { DocumentApi } from '../../documents/Document.api';

interface CorrespondenceToBeRendered {
  document: DocumentApi;
  origin: {
    unit: {
      sector: string;
      name: string;
      id: string;
    };
    designation: {
      id: string;
      title: string;
    };
  };
}

export type { CorrespondenceToBeRendered };

