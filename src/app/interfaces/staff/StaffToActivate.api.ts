interface StaffToActivate {
    staffNumber: number;
    fullName: string;
    email: string;
    profilePicture: string | null;
    signature: string | null;
    createdAt: string;
    completedAt: string | null;
}

export type {StaffToActivate}