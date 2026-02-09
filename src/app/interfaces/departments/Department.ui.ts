import { DepartmentCategory } from "./Department.entity";

interface DepartmentsUi {
    id: string;
    name: string;
    label: string;
    category: DepartmentCategory;
    deptHead: string;
}

export type { DepartmentsUi };