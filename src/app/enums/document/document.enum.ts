enum DocumentState {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ARCHIVED = 'ARCHIVED',
}

enum DocumentType {
  MEMO = 'memorandum',
  LETTER = 'letter',
  REPORT = 'report',
}

enum CorrespondenceAddressee {
  UNIT = 'unit',
  EXTERNAL = 'external',
}

enum RecipientSector {
  ACADEMIC = 'academic',
  NON_ACADEMIC = 'non-academic',
}

enum SensitivityLevel {
  PUBLIC = 'Public',
  INTERNAL = 'Internal',
  CONFIDENTIAL = 'Confidential',
  RESTRICTED = 'Restricted',
}

enum LifecycleActions {
  SAVE = 'save',
  CREATE = 'create',
  SUBMIT = 'submit',
  APPROVE = 'approve',
  REJECT = 'reject',
  CANCEL = 'cancel',
  ACTIVATE = 'activate',
  DECLARE_RECORD = 'declare_record',
  ARCHIVE = 'archive',
  DELETE = 'delete',
  DISPOSE = 'dispose',
}

enum LifecycleState {
  DRAFT = 'draft',
  IN_REVIEW = 'in_review',
  ACTIVE = 'active',
  DECLARED_RECORD = 'declared_record',
  ARCHIVED = 'archived',
  CANCELLED = 'cancelled',
  DISPOSED = 'disposed',
}

export {
  DocumentState,
  DocumentType,
  RecipientSector,
  CorrespondenceAddressee,
  SensitivityLevel,
  LifecycleActions,
  LifecycleState,
};
