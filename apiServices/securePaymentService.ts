// Secure Payment Service - Backend Integration
// This service communicates with your backend API
// Backend handles all sensitive operations with Paystack

import { Payment } from '@/types/publicTypes';
import { PaymentStatus } from '@/types/publicenums';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.closebuy.com/v1';

interface InitializePaymentRequest {
  orderId: number;
  amount: number;
  email: string;
  phone?: string;
  name?: string;
  metadata?: Record<string, any>;
}

interface InitializePaymentResponse {
  success: boolean;
  reference: string;
  authorization_url?: string;
  access_code?: string;
  publicKey: string;
  error?: string;
}

interface VerifyPaymentResponse {
  success: boolean;
  payment?: Payment;
  status: PaymentStatus;
  transactionData?: any;
  error?: string;
}

interface PaymentStatusResponse {
  status: PaymentStatus;
  reference?: string;
  amount?: number;
  paidAt?: string;
}

export const SecurePaymentService = {
  /**
   * Initialize payment - Backend handles secret key
   * Returns payment reference and public key for frontend
   */
  initializePayment: async (
    data: InitializePaymentRequest,
    token: string
  ): Promise<InitializePaymentResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to initialize payment');
      }

      return {
        success: true,
        reference: result.reference,
        authorization_url: result.authorization_url,
        access_code: result.access_code,
        publicKey: result.publicKey || process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
      };
    } catch (error: any) {
      console.error('Payment initialization error:', error);
      return {
        success: false,
        reference: '',
        publicKey: '',
        error: error.message || 'Network error occurred',
      };
    }
  },

  /**
   * Verify payment - Backend validates with Paystack
   * CRITICAL: Always verify payments on backend
   */
  verifyPayment: async (
    reference: string,
    token: string
  ): Promise<VerifyPaymentResponse> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/payments/verify/${reference}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Payment verification failed');
      }

      return {
        success: true,
        payment: result.payment,
        status: result.status,
        transactionData: result.transactionData,
      };
    } catch (error: any) {
      console.error('Payment verification error:', error);
      return {
        success: false,
        status: PaymentStatus.FAILED,
        error: error.message || 'Verification failed',
      };
    }
  },

  /**
   * Check payment status for an order
   */
  checkPaymentStatus: async (
    orderId: number,
    token: string
  ): Promise<PaymentStatusResponse> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/payments/status/${orderId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to check status');
      }

      return {
        status: result.status,
        reference: result.reference,
        amount: result.amount,
        paidAt: result.paidAt,
      };
    } catch (error: any) {
      console.error('Payment status check error:', error);
      return {
        status: PaymentStatus.PENDING,
      };
    }
  },

  /**
   * Request refund for a payment
   */
  requestRefund: async (
    paymentId: number,
    reason: string,
    token: string
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentId, reason }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Refund request failed');
      }

      return {
        success: true,
        message: result.message,
      };
    } catch (error: any) {
      console.error('Refund request error:', error);
      return {
        success: false,
        error: error.message || 'Failed to request refund',
      };
    }
  },

  /**
   * Get payment history for current user
   */
  getPaymentHistory: async (
    token: string,
    params?: { page?: number; limit?: number }
  ): Promise<{ success: boolean; payments?: Payment[]; error?: string }> => {
    try {
      const queryParams = new URLSearchParams(params as any).toString();
      const response = await fetch(
        `${API_BASE_URL}/payments/history?${queryParams}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch payment history');
      }

      return {
        success: true,
        payments: result.payments,
      };
    } catch (error: any) {
      console.error('Payment history error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Cancel pending payment
   */
  cancelPayment: async (
    reference: string,
    token: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/payments/cancel/${reference}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to cancel payment');
      }

      return { success: true };
    } catch (error: any) {
      console.error('Cancel payment error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

export default SecurePaymentService;

