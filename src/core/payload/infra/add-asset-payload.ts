export interface AddAssetPayload {
    name: string;
    quantity: number;
    price?: number;
    typeId: number;
    propertyId: number;
    unitId?: number;
    note?: string;
    image: string;
}
