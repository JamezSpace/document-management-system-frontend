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

interface CreatedDocument {
  id: string;
  ownerId: string;
  title: string;
  currentVersion: number | null;
  referenceNumber: string;
  classification: {
    functionCodeId: string;
    functionCode: string;
    sensitivity: string;
    documentTypeId: string;
    classifiedBy: string;
    classifiedAt: Date;
  };
  correspondence: {
    originatingUnitId: string;
    recipientCode: string;
    subjectCodeId: string;
    subjectCode: string;
  };
  retention: {
    policyVersion: number;
    retentionScheduleId: string;
    retentionStartDate: Date;
    disposalEligibilityDate: Date;
    archivalRequired: boolean;
  };
  createdAt: Date;
  updatedAt?: Date | null;
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
  updatedAt?: Date;
}

export type { CreatedDocument, DocumentApi, InitDocumentApiPayload };

