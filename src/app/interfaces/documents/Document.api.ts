import { DocumentVersion } from "./DocumentVersion.api";
import { ClassificationMetadata } from "./metadata/ClassificationMetadata.metadata";
import { CorrespondenceMetadata } from "./metadata/CorrespondenceMetadata.metadata";
import { RetentionMetadata } from "./metadata/RetentionMetadata.metadata";

interface InitDocumentApi {
    title: string,
	createdBy: string,
    
    // correspondence
    originatingUnitId: string,
    recipientUnitId: string,
    subjectCodeId: string,
    subjectCode: string,

    // classification
    functionCodeId: string,
    functionCode: string,
    sensitivity: string
}

interface DocumentApi {
    id: string;
	ownerId: string;
	title: string;
	current_version?: DocumentVersion;
    reference_number?: string;

	// Governance Domains (Value Objects)
	classification: ClassificationMetadata;
    correspondence: CorrespondenceMetadata;
	retention: RetentionMetadata;

    createdAt: Date;
	modified_at?: Date;
}

export type { DocumentApi, InitDocumentApi };

