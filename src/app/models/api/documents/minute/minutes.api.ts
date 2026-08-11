import { MinuteAction } from "../../../../enums/document/minute.enum";

interface MinuteApi {
    id: string;
	documentId: string;
	authorStaffId: string;
	inboxEntryId: string | null;
	parentMinuteId: string | null;
	action: MinuteAction;
	content: string | null;
	createdAt: Date;
}

interface InitMinutePayload {
    authorStaffId: string;
	action: MinuteAction;
	content: string | null;
	inboxEntryId?: string;
	parentMinuteId?: string | null;
}

export type {MinuteApi, InitMinutePayload};