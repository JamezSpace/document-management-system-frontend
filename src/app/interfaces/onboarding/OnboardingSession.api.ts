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
	started_at: string;
	last_active_at: Date | null;
	completed_at: Date | null;
}

interface OnboardingSessionView {
    id: string;
	inviteId: string;
	email: string;

	currentStep: number;
	primaryData: unknown;
	profilePictureUrl: string | null;
	signatureUrl: string | null;

	status: OnboardingSessionStatus;
	startedAt: string;
	lastActiveAt: Date | null;
	completedAt: string | null;
}

export type {OnboardingSession, OnboardingSessionView};