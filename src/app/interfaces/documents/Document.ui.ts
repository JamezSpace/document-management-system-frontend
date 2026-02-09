import { DocumentState, DocumentType } from "./Document.entity";

interface DocumentUi {
    id: string;
    state: DocumentState;
    type: DocumentType;
    metadata: {
        title: string;
    }
}

export type { DocumentUi };
