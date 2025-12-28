// Backend API Service for Orders
// This service provides endpoints ready for backend integration

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.closebuy.com/v1';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        // Add authentication token if needed
        // 'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Request failed',
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Network error',
    };
  }
}

export const OrderService = {
  /**
   * Create a new order
   * POST /orders
   */
  createOrder: async (orderData: any) => {
    return apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  /**
   * Get all orders for current user
   * GET /orders
   */
  getOrders: async (params?: { status?: string; page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams(params as any).toString();
    return apiCall(`/orders?${queryParams}`, {
      method: 'GET',
    });
  },

  /**
   * Get single order by ID
   * GET /orders/:id
   */
  getOrderById: async (orderId: string) => {
    return apiCall(`/orders/${orderId}`, {
      method: 'GET',
    });
  },

  /**
   * Update order status
   * PATCH /orders/:id/status
   */
  updateOrderStatus: async (orderId: string, status: string) => {
    return apiCall(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  /**
   * Cancel order
   * POST /orders/:id/cancel
   */
  cancelOrder: async (orderId: string, reason?: string) => {
    return apiCall(`/orders/${orderId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  /**
   * Track order
   * GET /orders/:id/track
   */
  trackOrder: async (orderId: string) => {
    return apiCall(`/orders/${orderId}/track`, {
      method: 'GET',
    });
  },

  /**
   * Get order invoice
   * GET /orders/:id/invoice
   */
  getOrderInvoice: async (orderId: string) => {
    return apiCall(`/orders/${orderId}/invoice`, {
      method: 'GET',
    });
  },
};

export const PaymentService = {
  /**
   * Initialize payment with Paystack
   * POST /payments/initialize
   */
  initializePayment: async (paymentData: any) => {
    return apiCall('/payments/initialize', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  /**
   * Verify payment with Paystack
   * GET /payments/verify/:reference
   */
  verifyPayment: async (reference: string) => {
    return apiCall(`/payments/verify/${reference}`, {
      method: 'GET',
    });
  },

  /**
   * Get saved payment methods
   * GET /payments/methods
   */
  getPaymentMethods: async () => {
    return apiCall('/payments/methods', {
      method: 'GET',
    });
  },

  /**
   * Add payment method
   * POST /payments/methods
   */
  addPaymentMethod: async (methodData: any) => {
    return apiCall('/payments/methods', {
      method: 'POST',
      body: JSON.stringify(methodData),
    });
  },

  /**
   * Delete payment method
   * DELETE /payments/methods/:id
   */
  deletePaymentMethod: async (methodId: string) => {
    return apiCall(`/payments/methods/${methodId}`, {
      method: 'DELETE',
    });
  },
};

export const AddressService = {
  /**
   * Get saved addresses
   * GET /addresses
   */
  getAddresses: async () => {
    return apiCall('/addresses', {
      method: 'GET',
    });
  },

  /**
   * Add new address
   * POST /addresses
   */
  addAddress: async (addressData: any) => {
    return apiCall('/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  },

  /**
   * Update address
   * PUT /addresses/:id
   */
  updateAddress: async (addressId: string, addressData: any) => {
    return apiCall(`/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    });
  },

  /**
   * Delete address
   * DELETE /addresses/:id
   */
  deleteAddress: async (addressId: string) => {
    return apiCall(`/addresses/${addressId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Set default address
   * PATCH /addresses/:id/default
   */
  setDefaultAddress: async (addressId: string) => {
    return apiCall(`/addresses/${addressId}/default`, {
      method: 'PATCH',
    });
  },
};

export const CartService = {
  /**
   * Sync cart with server
   * POST /cart/sync
   */
  syncCart: async (cartItems: any[]) => {
    return apiCall('/cart/sync', {
      method: 'POST',
      body: JSON.stringify({ items: cartItems }),
    });
  },

  /**
   * Get cart from server
   * GET /cart
   */
  getCart: async () => {
    return apiCall('/cart', {
      method: 'GET',
    });
  },

  /**
   * Clear cart
   * DELETE /cart
   */
  clearCart: async () => {
    return apiCall('/cart', {
      method: 'DELETE',
    });
  },

  /**
   * Calculate shipping fee
   * POST /cart/shipping-fee
   */
  calculateShippingFee: async (addressData: any) => {
    return apiCall('/cart/shipping-fee', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  },

  /**
   * Apply promo code
   * POST /cart/promo
   */
  applyPromoCode: async (code: string) => {
    return apiCall('/cart/promo', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },
};

export const ProductService = {
  /**
   * Get products
   * GET /products
   */
  getProducts: async (params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams(params as any).toString();
    return apiCall(`/products?${queryParams}`, {
      method: 'GET',
    });
  },

  /**
   * Get product by ID
   * GET /products/:id
   */
  getProductById: async (productId: string) => {
    return apiCall(`/products/${productId}`, {
      method: 'GET',
    });
  },

  /**
   * Check product availability
   * GET /products/:id/availability
   */
  checkAvailability: async (productId: string, quantity: number) => {
    return apiCall(`/products/${productId}/availability?quantity=${quantity}`, {
      method: 'GET',
    });
  },
};

export default {
  OrderService,
  PaymentService,
  AddressService,
  CartService,
  ProductService,
};

