import { DepartmentCategory } from "./Department.entity";


interface DepartmentsApi {
    id: string;
    name: string;
    category: DepartmentCategory;
    label: string;
    deptHead: string;
    createdAt: Date;
    modifiedAt: Date;
}

export type { DepartmentsApi };
