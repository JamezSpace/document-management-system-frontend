import { Staff } from "../onboarding/Staff.api";

// TODO: delete file after implementation of directives feature
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

export type { DirectiveUi };

