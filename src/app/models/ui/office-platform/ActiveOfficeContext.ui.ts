import type { OfficeWorkbenchDefinition } from './office-navigation';
import type { OfficeWorkbenchKey } from './office-workbench';

interface ActiveOfficeContext {
  officeId: string;
  officeName: string;
  unitId: string;
  workbench: OfficeWorkbenchKey;
  definition: OfficeWorkbenchDefinition;
}

export type { ActiveOfficeContext };
