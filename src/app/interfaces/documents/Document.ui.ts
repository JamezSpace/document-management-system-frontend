import { DocumentState, DocumentType } from "./Document.entity";

interface Document {
    id: string;
    state: DocumentState;
    type: DocumentType;
    metadata: {
        title: string;
    }
}

export type { Document };
