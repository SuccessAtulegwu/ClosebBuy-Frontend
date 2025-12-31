import { OrderStatus, PaymentStatus, Role,} from "./publicenums";

export interface OrderItemDto {
    productId: number;
    vendorId: number;
    quantity: number;
    unitPrice: number;
}


export interface CreateOrderDto {
    customerId: number;
    total: number;
    currency: string;
    subtotal: number;
    deliveryFee: number;
    tax: number;
    deliveryId?: number;
    paymentMethod: string;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    items: OrderItemDto[];
    estimatedDelivery?: string;
    deliveryDetails: CreateDeliveryDetailDto
    orderNumber: string;
}

export interface CreateDeliveryDetailDto {
    userId: number;
    address: string;
    city: string;
    state: string;
    postalCode?: string;
    phoneNumber: string;
    landmark?: string;
    name?: string;
}

export interface CreateUserDto {
    email: string;
    name?: string;
    role?: Role;
    estateId?: number;
}

export interface CreateUserDto {
    email: string;
    name?: string;
    role?: Role;
    estateId?: number;
}

export interface UpdateUserDto{
    name?: string;
    role?: Role;
    estateId?: number;
}