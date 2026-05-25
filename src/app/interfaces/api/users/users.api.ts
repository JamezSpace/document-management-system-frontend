enum IdentityStatus {
    PENDING = "pending",     // Account created, not yet verified
    ACTIVE = "active",       // Full access
    SUSPENDED = "suspended", // Temporary lock (e.g., query/disciplinary)
    RETIRED = "retired",     // Read-only access (often for life)
    RESIGNED = "resigned",   // No access
    TERMINATED = "terminated" // No access, blacklisted
}

interface Users {
    id: string;
	authProviderId: string;
	email: string;
	phoneNum: string;
	firstName: string;
	lastName: string;
	middleName: string;
	createdAt: Date;
	updatedAt?: Date | undefined;
	status: IdentityStatus;
}

export type {Users};