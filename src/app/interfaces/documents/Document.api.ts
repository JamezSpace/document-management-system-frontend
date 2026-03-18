import { SensitivityLevel } from './Document.enum';
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
  updatedAt: Date | null;
}

const emptyDocument: DocumentApi = {
  id: '',
  ownerId: '',
  title: '',
  // Governance Domains initialized with safe defaults
  classification: {
    sensitivity: SensitivityLevel.INTERNAL, 
    functionCodeId: '',
    documentTypeId: '',
    classifiedBy: '',
    classifiedAt: new Date(0),
  },
  correspondence: {
    originatingUnitId: '',
    recipientCode: '',
    subjectCodeId: '',
    direction: '',
  },
  retention: {
    policyVersion: 0,
    retentionScheduleId: '',
    retentionStartDate: new Date(0),
    disposalEligibilityDate: new Date(0),
    archivalRequired: false,
  },
  createdAt: new Date(0),
  updatedAt: null,
};

export {emptyDocument, type DocumentApi, type InitDocumentApiPayload };

