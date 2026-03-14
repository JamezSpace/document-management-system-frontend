import { LifecycleMetadata } from "./metadata/LifecycleMetadata.metadata";

interface DocumentVersion {
    id: string;
    document_id: string;
	version_number: number;
	media_id: string;
	lifecycle: LifecycleMetadata;
}

export type {DocumentVersion};