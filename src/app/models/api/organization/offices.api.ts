import type { OfficeWorkbenchKey } from '../../ui/office-platform/office-workbench';

interface OfficeApi {
    id: string;
    name: string;
    unitId: string;
    workbench?: OfficeWorkbenchKey;
    createdAt: Date;
    updatedAt?: Date | null;
}

export type { OfficeApi };
