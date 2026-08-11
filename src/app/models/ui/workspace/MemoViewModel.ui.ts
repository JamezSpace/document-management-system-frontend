import { DocumentApi } from "../../api/documents/Document.api";

interface MemoViewModel {
  document: DocumentApi;
  origin: {
    unit: {
      name: string;
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
    };
  } | null;
}

export type { MemoViewModel };