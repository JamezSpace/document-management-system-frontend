interface DirectiveDetailApi {
    id: string;
    subject: string;
    priorityLevel: string;
    instruction: string;
    registryVolume: string;
    addressedTo: string[];
    createdAt: Date;
    modified: Date | null
}

export type {DirectiveDetailApi};