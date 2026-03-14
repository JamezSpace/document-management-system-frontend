interface BussFunctionApi {
  id: string;
  subjectId: string;
  code: string;
  name: string;
  description: string;
  createdAt: Date;
  uploaded_at: Date;
}

export type { BussFunctionApi };
