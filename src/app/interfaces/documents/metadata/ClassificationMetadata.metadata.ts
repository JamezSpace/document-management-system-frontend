import { SensitivityLevel } from "../Document.enum";
import { DocumentType } from "../Document.enum";

interface ClassificationMetadata {
  sensitivity: SensitivityLevel
  function_code: string
  document_type: DocumentType;

  classified_by: string;
  classified_at: Date;

  last_reclassified_at?: Date | null;
  last_reclassified_by?: string | null;
}

export type { ClassificationMetadata };