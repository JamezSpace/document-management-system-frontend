import { OrgUnitCategory } from "../../enum/identity/unitCategory.enum";

interface DepartmentsUi {
    id: string;
    name: string;
    label: string;
    category: OrgUnitCategory;
    deptHead: string;
}

export type { DepartmentsUi };