import { Customer } from "./customer";

export interface Vehicle extends BaseModel {
    customerId: number;
    customer?: Customer;
    name: string;
    licensePlate: string;
    image?: string;
}
