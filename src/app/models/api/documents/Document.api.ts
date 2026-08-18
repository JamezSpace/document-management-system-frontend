import { SensitivityLevel } from '../../../enums/document/document.enum';
import { DocumentVersion } from './DocumentVersion.api';
import { AddresseeMetadata } from './metadata/AddresseeMetadata.metadata';
import { ClassificationMetadata } from './metadata/ClassificationMetadata.metadata';
import { CorrespondenceMetadata } from './metadata/CorrespondenceMetadata.metadata';
import { RetentionMetadata } from './metadata/RetentionMetadata.metadata';

interface InitDocumentApiPayload {
  title: string;
  documentTypeId: string;
  direction: string;

  // correspondence
  originatingUnitId: string;
  recipientUnitId: string;
  addressedToDesignationId: string | null;
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

  // governance domains
  addressees: AddresseeMetadata[];
  classification: ClassificationMetadata;
  correspondence: CorrespondenceMetadata;
  retention: RetentionMetadata;

  createdAt: Date;
  updatedAt: Date | null;
}

interface DocumentApiWithSharedTag extends DocumentApi {
    shared?: boolean;
}

const emptyDocument: DocumentApi = {
  id: '',
  ownerId: '',
  title: '',
  // Governance Domains initialized with safe defaults
  addressees: [{
    addressedToDesignationId: null,
    recipientUnitId: '',
    isPrimary: false
  }],
  classification: {
    sensitivity: SensitivityLevel.INTERNAL, 
    functionCodeId: '',
    documentTypeId: '',
    classifiedBy: '',
    classifiedAt: new Date(0),
  },
  correspondence: {
    originatingUnitId: '',
    recipientUnitId: null,
    addressedToStaffId: null,
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

export {emptyDocument, type DocumentApi, type DocumentApiWithSharedTag, type InitDocumentApiPayload };

