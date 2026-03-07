export interface AddCustomerPayload {
    name: string;
    phone: string;
    propertyId: number;
    email?: string;
    cccd?: string;
    genderId?: number;
    provinceId?: number;
    wardId?: number;
    unitId?: number;
    dateOfBirth?: string;
    address?: string;
    image?: string;
    job?: string;
}
