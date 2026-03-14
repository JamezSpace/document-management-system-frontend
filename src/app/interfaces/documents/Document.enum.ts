enum DocumentState {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ARCHIVED = 'ARCHIVED',
}

enum DocumentType {
     MEMO = "MEMORANDUM",
    LETTER = "LETTER",
    REPORT = "REPORT"
}

enum CorrespondenceAddressee {
    UNIT = 'unit',
    EXTERNAL = 'external'
}

enum RecipientSector {
    ACADEMIC = 'academic',
    NON_ACADEMIC = 'non-academic'
}

enum SensitivityLevel {
  PUBLIC = "PUBLIC",
  INTERNAL = "INTERNAL",
  CONFIDENTIAL = "CONFIDENTIAL",
  RESTRICTED = "RESTRICTED"
}

enum LifecycleActions {
    SAVE = "save",
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


export { DocumentState, DocumentType, RecipientSector, CorrespondenceAddressee, SensitivityLevel, LifecycleActions };
