enum DocumentState {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ARCHIVED = 'ARCHIVED',
}

enum DocumentType {
    INTERNAL_MEMO = "INTERNAL MEMORANDUM",
    EXTERNAL_MEMO = "EXTERNAL MEMORANDUM",
    LETTER = "LETTER",
    OTHERS = "OTHERS"
}

export { DocumentState, DocumentType };
