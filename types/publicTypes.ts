import {
  NotificationType,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Role,
  VendorStatus,
} from "./publicenums"

export interface User {
  id: number
  firebaseUid: string
  email: string
  name: string
  role: Role
  estateId: number
  Estate: Estate
  orders: Order[]
  payments: Payment[]
  notifications: Notification[]
  deliveryDetails: DeliveryDetail[]
  messagesSent: Message[]
  messagesReceived: Message[]
  createdAt: Date
}

export interface Payment {
  id: number
  orderId: number
  userId: number
  name: string
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  transactionRef: string
  createdAt: Date
  order: Order
  user: User
}

export interface Vendor {
  id: number
  userId: number
  storeName: string
  payoutInfo?: any
  estateId: number
  isAvailable: boolean
  status: VendorStatus
  products: Product[]
  Estate: Estate
  user: User
}

export interface Estate {
  id: number
  name: string
  address: string
  Managers: User[]
  Vendors: Vendor[]
  Residents: User[]
}

export interface ProductCategory {
  id: number
  name: string
  products: Product[]
}

export interface Product {
  id: number
  vendorId: number
  title: string
  sku: string
  description: string
  price: number
  stock: number
  categoryId: number
  category: ProductCategory
  images: ProductImage[]
  orderItems: OrderItem[]
}

export interface ProductImage {
  id: number
  productId: number
  url: string
  product: Product
}

export interface Order {
  id: number
  customerId: number
  total: number
  subtotal: number;
  deliveryFee: number;
  tax: number;
  currency: string
  deliveryId: number
  riderId?: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: string;
  items: OrderItem[]
  payment?: Payment
  createdAt: Date
  customer: User
  rider?: User
  estimatedDelivery?: string;
  orderNumber: string;
  delivery?: DeliveryDetail
}

export interface OrderItem {
  id: number
  orderId: number
  productId: number
  vendorId: number
  unitPrice: number
  quantity: number
  subtotal: number
  order: Order
  product: Product
  vendor: Vendor
}

export interface Notification {
  id: number
  userId: number
  user: User
  title: string
  message: string
  type: NotificationType
  isRead: boolean
  createdAt: Date
}

export interface DeliveryDetail {
  id: number
  userId: number
  user: User
  address: string
  city: string
  name: string
  state: string
  postalCode: string
  phoneNumber: string
  landmark: string
  orders: Order[]
}

export interface Message {
  id: number
  senderId: number
  receiverId: number
  sender: User
  receiver: User
  content: string
  isRead: boolean
  createdAt: Date
}
