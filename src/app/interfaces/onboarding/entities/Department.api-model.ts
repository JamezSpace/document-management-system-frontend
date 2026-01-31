import type { Staff } from './Staff.api-model';

interface Department {
  id: string;
  name: string;
  hod: Staff;
}

export type { Department };
