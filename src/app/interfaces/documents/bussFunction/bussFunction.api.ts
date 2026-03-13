interface BussFunctionApi {
  id: string;
  subjectId: string;
  code: string;
  name: string;
  description: string;
  created_at: Date;
  uploaded_at: Date;
}

export type { BussFunctionApi };
