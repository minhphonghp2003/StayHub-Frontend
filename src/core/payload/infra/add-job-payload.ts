export interface AddJobPayload {
    name: string;
    propertyId: number;
    unitId?: number;
    description: string;
    isActive: boolean;
}
