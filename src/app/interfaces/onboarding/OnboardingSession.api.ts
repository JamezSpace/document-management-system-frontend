import { OnboardingSessionStatus } from "../../enum/onboarding/sessionStatus.enum";

interface OnboardingSession {
    id: string;
	invite_id: string;
	email: string;

	current_step: number;
	primary_data: unknown;
	profile_picture_media_id: string | null;
	signature_media_id: string | null;

	status: OnboardingSessionStatus;
	started_at: Date;
	last_active_at: Date | null;
	completed_at: Date | null;
}

export type {OnboardingSession};