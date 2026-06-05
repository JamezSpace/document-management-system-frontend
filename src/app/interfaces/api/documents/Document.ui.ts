import { DocumentState, DocumentType } from "../../../enum/document/document.enum";

interface DocumentUi {
    id: string;
    state: DocumentState;
    type: DocumentType;
    metadata: {
        title: string;
    }
}

export type { DocumentUi };

