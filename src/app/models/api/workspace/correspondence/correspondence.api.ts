import { DocumentApi } from '../../documents/Document.api';

interface CorrespondenceToBeRendered {
  document: DocumentApi;
  origin: {
    unit: {
      sector: string;
      name: string;
      id: string;
    };
  };
  recipient: {
    unit: {
      id: string;
      name: string;
    };
    designation: {
        id: string;
        title: string;
    }
  }
}

export type { CorrespondenceToBeRendered };
