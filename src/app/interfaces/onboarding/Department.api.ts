import type { Staff } from './Staff.api';

interface Department {
  id: string;
  name: string;
  hod: Staff;
}

export type { Department };
