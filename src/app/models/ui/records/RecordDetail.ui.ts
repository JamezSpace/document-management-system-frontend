interface RecordDetail {
  reference: string;
  title: string;
  classification: string;
  sensitivity: string;
  custodian: string;
  status: string;
  retention: string;
  activity: readonly string[];
}

export type { RecordDetail };
