import { OnboardingSessionStatus } from "../../enum/onboarding/sessionStatus.enum";

interface OnboardingSession {
    id: string;
	inviteId: string;
	email: string;

	currentStep: number;
	primaryData: unknown;
	profilePicPublicURL: string | null;
	signaturePublicURL: string | null;

	status: OnboardingSessionStatus;
	startedAt: string;
	lastActiveAt: Date | null;
	completedAt: Date | null;
}

export type { OnboardingSession };
