interface PersonnelRecord {
  id: string;
  staffNumber: string;
  name: string;
  designation: string;
  office: string;
  appointment: string;
  employmentStatus: string;
  classification: string;
  hold: string;
  timeline: readonly string[];
  documents: readonly string[];
  accessHistory: readonly string[];
}

export type { PersonnelRecord };
