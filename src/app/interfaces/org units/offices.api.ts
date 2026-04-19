interface OfficeApi {
    id: string;
    name: string;
    unitId: string;
    createdAt: Date;
    updatedAt?: Date | null;
}

export type { OfficeApi };
