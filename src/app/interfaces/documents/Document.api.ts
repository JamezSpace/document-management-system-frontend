import { DocumentState, DocumentType } from "./Document.entity";

interface Document {
    id: string;
    state: DocumentState;
    createdAt: Date;
    modifiedAt: Date;
    type: DocumentType;
    metadata: {
        title: string;
    }
}

export type {Document}