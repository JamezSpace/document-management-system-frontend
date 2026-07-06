import { NotificationPreference, NotificationPriority, NotificationRecipientType, NotificationState } from "../../../enum/notices/notices.enum";

interface NoticesApi {
     notificationId: string;
	recipientId: string;
	recipientType: NotificationRecipientType;
	eventType: string;
	subjectType: string;
	subjectId: string;
	inAppSubjectName: string | null;
	emailSubjectHeader: string | null;
	messageTemplate: string;
	payload: Record<string, any>;
	channel: NotificationPreference;
	priority: NotificationPriority;

	state: NotificationState;
	createdAt: Date;
}

export type {NoticesApi};