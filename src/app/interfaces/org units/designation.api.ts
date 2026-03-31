interface DesignationApi {
    id : string;
	title :string;
	description? :string | undefined;
	hierarchyLevel :number;
	officeId:string;
	createdAt?:Date;
	updatedAt?:Date | undefined;
}

export type {DesignationApi};