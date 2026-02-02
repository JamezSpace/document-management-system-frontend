import { DocumentState, DocumentType } from "../shared/Document.interface";

interface Document {
    id: string;
    state: DocumentState;
    type: DocumentType;
    metadata: {
        title: string;
    }
}

export type {Document}