import { Staff } from "../../onboarding/Staff.api";

interface DirectiveApi {
    id: string;
    heading: string;
    recipients: Staff[],
    seenCount: number;
    acknowledgementCount: number;
    modifiedAt: Date
}

export type { DirectiveApi };
