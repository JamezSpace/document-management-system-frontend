import { SensitivityLevel } from "../Document.enum";

interface ClassificationMetadata {
  sensitivity: SensitivityLevel
  functionCode: string
  documentTypeId: string;

  classifiedBy: string;
  classifiedAt: Date;

  lastReclassifiedAt?: Date | null;
  lastReclassifiedBy?: string | null;
}

export type { ClassificationMetadata };