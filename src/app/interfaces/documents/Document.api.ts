import { DocumentVersion } from './DocumentVersion.api';
import { ClassificationMetadata } from './metadata/ClassificationMetadata.metadata';
import { CorrespondenceMetadata } from './metadata/CorrespondenceMetadata.metadata';
import { RetentionMetadata } from './metadata/RetentionMetadata.metadata';

interface InitDocumentApi {
  title: string;
  createdBy: string;

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
    documentType: string;
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
  modifiedAt: Date | null;
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

export type { DocumentApi, InitDocumentApi, CreatedDocument };
