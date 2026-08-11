import { DocumentState } from "../../../enums/document/document.enum";
import { DocumentType } from "../../../enums/document/document.enum";

interface DocumentUi {
    id: string;
    state: DocumentState;
    type: DocumentType;
    metadata: {
        title: string;
    }
}

export type { DocumentUi };

