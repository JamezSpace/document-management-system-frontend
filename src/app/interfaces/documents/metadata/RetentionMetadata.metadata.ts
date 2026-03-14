interface RetentionMetadata {
    policy_version: number;
	retention_schedule_id: string;
	retention_start_date: Date;
	disposal_eligibility_date: Date;
	archival_required: boolean;
}

export type { RetentionMetadata };
