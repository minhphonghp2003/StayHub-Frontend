export interface UpdateServicePayload {
    name: string;
    unitTypeId: number;
    price: number;
    propertyId: number;
    description?: string;
}