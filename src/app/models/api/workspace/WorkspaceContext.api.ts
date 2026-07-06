import { WorkspaceActions } from "../../../enums/workspace/actions.enum";
import { DocumentApi } from "../documents/Document.api";


interface WorkspaceContextApi {
    mode: "edit" | "readonly",
	authorizedActions: WorkspaceActions[],
    metadata: {
        isAuthor: boolean,
        document: DocumentApi
    }
}

export type {WorkspaceContextApi};
