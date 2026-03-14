import { DocumentState, DocumentType } from "./Document.enum";

interface DocumentUi {
    id: string;
    state: DocumentState;
    type: DocumentType;
    metadata: {
        title: string;
    }
}

export type { DocumentUi };

