import { DocumentVersion } from './DocumentVersion.api';
import { ClassificationMetadata } from './metadata/ClassificationMetadata.metadata';
import { CorrespondenceMetadata } from './metadata/CorrespondenceMetadata.metadata';
import { RetentionMetadata } from './metadata/RetentionMetadata.metadata';

interface InitDocumentApiPayload {
  title: string;
  createdBy: string;
  documentTypeId: string;
  direction: string;
  addressedTo: string;

  // correspondence
  originatingUnitId: string;
  recipientUnitId: string;
  subjectCodeId: string;
  subjectCode: string;

  // classification
  functionCodeId: string;
  functionCode: string;
  sensitivity: string;
}

interface DocumentApi {
  id: string;
  ownerId: string;
  title: string;
  currentVersion?: DocumentVersion;
  referenceNumber?: string;

  // Governance Domains (Value Objects)
  classification: ClassificationMetadata;
  correspondence: CorrespondenceMetadata;
  retention: RetentionMetadata;

  createdAt: Date;
  updatedAt?: Date | null;
}

export type { DocumentApi, InitDocumentApiPayload };

