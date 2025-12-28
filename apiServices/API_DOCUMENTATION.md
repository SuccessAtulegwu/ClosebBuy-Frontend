# Order Management API Endpoints

This document describes the backend API endpoints needed for the order management system.

## Base URL
```
https://api.closebuy.com/v1
```

## Authentication
All endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer {token}
```

---

## Orders API

### 1. Create Order
**POST** `/orders`

Create a new order with cart items, shipping address, and payment method.

**Request Body:**
```json
{
  "items": [
    {
      "id": 1,
      "name": "Product Name",
      "price": 1000,
      "quantity": 2,
      "image": "url",
      "category": "fruits"
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "phoneNumber": "08012345678",
    "address": "123 Main Street",
    "city": "Lagos",
    "state": "Lagos",
    "zipCode": "100001",
    "country": "Nigeria"
  },
  "paymentMethod": {
    "type": "card",
    "cardNumber": "4111111111111111",
    "cardHolderName": "John Doe"
  },
  "subtotal": 2000,
  "deliveryFee": 500,
  "tax": 150,
  "total": 2650
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "ord_123456",
    "orderNumber": "ORD-1234567890",
    "status": "pending",
    "createdAt": "2024-01-01T12:00:00Z",
    "estimatedDelivery": "2024-01-04T12:00:00Z",
    "total": 2650
  }
}
```

---

### 2. Get All Orders
**GET** `/orders?status={status}&page={page}&limit={limit}`

Get all orders for the authenticated user.

**Query Parameters:**
- `status` (optional): Filter by order status (pending, confirmed, processing, shipped, delivered, cancelled)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

---

### 3. Get Order by ID
**GET** `/orders/:id`

Get detailed information about a specific order.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "ord_123456",
    "orderNumber": "ORD-1234567890",
    "items": [...],
    "shippingAddress": {...},
    "paymentMethod": {...},
    "subtotal": 2000,
    "deliveryFee": 500,
    "tax": 150,
    "total": 2650,
    "status": "shipped",
    "trackingNumber": "TRK123456",
    "createdAt": "2024-01-01T12:00:00Z",
    "estimatedDelivery": "2024-01-04T12:00:00Z"
  }
}
```

---

### 4. Update Order Status
**PATCH** `/orders/:id/status`

Update the status of an order (admin only).

**Request Body:**
```json
{
  "status": "shipped"
}
```

---

### 5. Cancel Order
**POST** `/orders/:id/cancel`

Cancel an order (only if status is 'pending' or 'confirmed').

**Request Body:**
```json
{
  "reason": "Changed my mind"
}
```

---

### 6. Track Order
**GET** `/orders/:id/track`

Get real-time tracking information for an order.

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "ord_123456",
    "status": "shipped",
    "trackingNumber": "TRK123456",
    "currentLocation": "Lagos Distribution Center",
    "estimatedDelivery": "2024-01-04T12:00:00Z",
    "history": [
      {
        "status": "pending",
        "timestamp": "2024-01-01T12:00:00Z",
        "description": "Order placed"
      },
      {
        "status": "confirmed",
        "timestamp": "2024-01-01T13:00:00Z",
        "description": "Order confirmed"
      }
    ]
  }
}
```

---

### 7. Get Order Invoice
**GET** `/orders/:id/invoice`

Get invoice details for an order.

**Response:**
```json
{
  "success": true,
  "data": {
    "invoiceNumber": "INV-123456",
    "orderNumber": "ORD-1234567890",
    "date": "2024-01-01",
    "items": [...],
    "subtotal": 2000,
    "deliveryFee": 500,
    "tax": 150,
    "total": 2650,
    "downloadUrl": "https://..."
  }
}
```

---

## Payment API

### 1. Initialize Payment
**POST** `/payments/initialize`

Initialize a payment transaction.

**Request Body:**
```json
{
  "orderId": "ord_123456",
  "amount": 2650,
  "paymentMethod": {
    "type": "card",
    "cardNumber": "4111111111111111",
    "expiryDate": "12/25",
    "cvv": "123"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reference": "pay_ref_123456",
    "authorizationUrl": "https://payment.gateway.com/...",
    "accessCode": "abc123"
  }
}
```

---

### 2. Verify Payment
**GET** `/payments/verify/:reference`

Verify payment transaction status.

---

### 3. Get Payment Methods
**GET** `/payments/methods`

Get saved payment methods for the user.

---

### 4. Add Payment Method
**POST** `/payments/methods`

Save a new payment method.

---

### 5. Delete Payment Method
**DELETE** `/payments/methods/:id`

Remove a saved payment method.

---

## Address API

### 1. Get Addresses
**GET** `/addresses`

Get all saved addresses for the user.

---

### 2. Add Address
**POST** `/addresses`

Save a new address.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "phoneNumber": "08012345678",
  "address": "123 Main Street",
  "city": "Lagos",
  "state": "Lagos",
  "zipCode": "100001",
  "country": "Nigeria",
  "isDefault": true
}
```

---

### 3. Update Address
**PUT** `/addresses/:id`

Update an existing address.

---

### 4. Delete Address
**DELETE** `/addresses/:id`

Delete a saved address.

---

### 5. Set Default Address
**PATCH** `/addresses/:id/default`

Set an address as the default shipping address.

---

## Cart API

### 1. Sync Cart
**POST** `/cart/sync`

Sync local cart with server.

---

### 2. Get Cart
**GET** `/cart`

Get cart from server.

---

### 3. Clear Cart
**DELETE** `/cart`

Clear all items from cart.

---

### 4. Calculate Shipping Fee
**POST** `/cart/shipping-fee`

Calculate shipping fee based on address and cart items.

**Request Body:**
```json
{
  "address": {
    "city": "Lagos",
    "state": "Lagos"
  },
  "items": [...]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "deliveryFee": 500,
    "estimatedDelivery": "3-5 business days"
  }
}
```

---

### 5. Apply Promo Code
**POST** `/cart/promo`

Apply a promotional code to the cart.

**Request Body:**
```json
{
  "code": "SAVE20"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "discount": 400,
    "code": "SAVE20",
    "message": "20% discount applied"
  }
}
```

---

## Error Responses

All endpoints may return error responses in this format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

**Common Error Codes:**
- `UNAUTHORIZED`: Invalid or missing authentication token
- `INVALID_REQUEST`: Invalid request parameters
- `NOT_FOUND`: Resource not found
- `ORDER_ALREADY_CANCELLED`: Cannot modify cancelled order
- `PAYMENT_FAILED`: Payment processing failed
- `INSUFFICIENT_STOCK`: Product out of stock

---

## Webhooks

### Order Status Update
**POST** `{your_webhook_url}`

Receive real-time updates when order status changes.

**Payload:**
```json
{
  "event": "order.status_updated",
  "orderId": "ord_123456",
  "status": "shipped",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

---

## Testing

Use the following test credentials in development:

**Test Card Numbers:**
- Success: 4111111111111111
- Declined: 4000000000000002
- Insufficient funds: 4000000000009995

**Test Environment Base URL:**
```
https://api-dev.closebuy.com/v1
```

