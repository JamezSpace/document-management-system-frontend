import type { Staff } from '../../api/onboarding/Staff.api';

interface WorkTask {
  id: string;
  heading: string;
  recipients: Staff[];
  compliance: {
    seen: number;
    acknowledged: number;
  };
  modifiedAt: string;
}

export type { WorkTask };
