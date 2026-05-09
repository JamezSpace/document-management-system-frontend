interface CorrespondenceMetadata {
	originatingUnitId: string;
	recipientUnitId: string | null;
    addressedToStaffId: string | null;
	subjectCodeId: string;
    direction: string;
}

export type { CorrespondenceMetadata };