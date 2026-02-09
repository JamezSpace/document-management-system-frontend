import { DocumentState, DocumentType } from "./Document.entity";

interface DocumentApi {
    id: string;
    state: DocumentState;
    createdAt: Date;
    modifiedAt: Date;
    type: DocumentType;
    metadata: {
        title: string;
    }
}

export type {DocumentApi}