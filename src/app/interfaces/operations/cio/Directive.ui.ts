import { Staff } from "../../onboarding/entities/Staff.api";

interface DirectiveUi {
    id: string;
    heading: string;
    recipients: Staff[],
    compliance: {
        seen: number;
        acknowledged: number;
    };
    modifiedAt: string
}

export type {DirectiveUi}