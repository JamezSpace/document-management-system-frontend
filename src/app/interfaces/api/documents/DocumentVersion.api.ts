import { LifecycleMetadata } from "./metadata/LifecycleMetadata.metadata";

interface DocumentVersion {
    id: string;
    documentId: string;
    contentDelta: unknown;
	versionNumber: number;
	mediaId: string;
	lifecycle: LifecycleMetadata;
}

export type {DocumentVersion};