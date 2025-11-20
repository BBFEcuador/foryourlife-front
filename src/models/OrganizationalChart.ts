export interface Member {
    id: string;
    email: string;
    name: string;
    phone: string;
    entityMap: Array<{ entity: string }>;
}

export interface OrgNode {
    id: string;
    parentId: string | null;
    parentNodeId: string | null;
    children: OrgNode[];
    members: Member;
    level: string;
}

export interface OrgChartPayload {
    id: null | string;
    teamId: string;
    masterLifes: any[];
    visionaries: {
        userId: string;
        staff: {
            userId: string;
            participantsIds: string[];
        }[];
    }[];
    staff: {
        userId: string;
        participantsIds: string[];
    }[];
}