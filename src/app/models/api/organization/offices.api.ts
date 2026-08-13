import type { OfficeWorkbenchKey } from '../../../office-platform/models/office-workbench';

interface OfficeApi {
    id: string;
    name: string;
    unitId: string;
    workbench?: OfficeWorkbenchKey;
    createdAt: Date;
    updatedAt?: Date | null;
}

export type { OfficeApi };
