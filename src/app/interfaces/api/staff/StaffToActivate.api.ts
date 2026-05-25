interface StaffToActivate {
    inviteId: string;
    staffNumber: number;
    fullName: string;
    email: string;
    profilePicture: string | null;
    signature: string | null;
    createdAt: string;
    completedAt: Date | null;
}

export type {StaffToActivate}