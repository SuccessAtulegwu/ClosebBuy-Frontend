// Paystack Payment Integration Service
// Documentation: https://paystack.com/docs/api

const PAYSTACK_PUBLIC_KEY = process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_XXXXX';
const PAYSTACK_SECRET_KEY = process.env.EXPO_PUBLIC_PAYSTACK_SECRET_KEY || 'sk_test_XXXXX';

interface PaystackPaymentData {
  amount: number;
  email: string;
  phone?: string;
  name?: string;
  reference?: string;
  callback_url?: string;
  metadata?: any;
  channels?: string[];
  subaccount?: string;
  transaction_charge?: number;
  bearer?: string;
}

interface PaystackResponse {
  status: 'success' | 'error';
  message: string;
  data?: any;
}

export const PaystackService = {
  /**
   * Initialize Paystack payment
   * This generates a payment authorization URL for the user
   */
  initializePayment: async (paymentData: PaystackPaymentData): Promise<PaystackResponse> => {
    try {
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: paymentData.email,
          amount: paymentData.amount * 100, // Paystack expects amount in kobo (smallest currency unit)
          reference: paymentData.reference || PaystackService.generateTransactionRef(),
          callback_url: paymentData.callback_url || 'closebuy://payment-callback',
          channels: paymentData.channels || ['card', 'bank', 'ussd', 'mobile_money'],
          metadata: {
            custom_fields: [
              {
                display_name: 'Customer Name',
                variable_name: 'customer_name',
                value: paymentData.name || '',
              },
              {
                display_name: 'Phone Number',
                variable_name: 'phone_number',
                value: paymentData.phone || '',
              },
            ],
            ...paymentData.metadata,
          },
        }),
      });

      const result = await response.json();

      if (result.status) {
        return {
          status: 'success',
          message: 'Payment initialized successfully',
          data: result.data,
        };
      } else {
        return {
          status: 'error',
          message: result.message || 'Failed to initialize payment',
          data: result,
        };
      }
    } catch (error: any) {
      return {
        status: 'error',
        message: error.message || 'Network error',
      };
    }
  },

  /**
   * Verify payment transaction
   * Call this after user completes payment
   */
  verifyPayment: async (reference: string): Promise<PaystackResponse> => {
    try {
      const response = await fetch(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();

      if (result.status && result.data.status === 'success') {
        return {
          status: 'success',
          message: 'Payment verified successfully',
          data: result.data,
        };
      } else {
        return {
          status: 'error',
          message: result.message || 'Payment verification failed',
          data: result,
        };
      }
    } catch (error: any) {
      return {
        status: 'error',
        message: error.message || 'Network error',
      };
    }
  },

  /**
   * Charge authorization (for saved cards)
   * Use this to charge a previously authorized card
   */
  chargeAuthorization: async (
    email: string,
    amount: number,
    authorizationCode: string,
    reference?: string
  ): Promise<PaystackResponse> => {
    try {
      const response = await fetch('https://api.paystack.co/transaction/charge_authorization', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount: amount * 100, // Convert to kobo
          authorization_code: authorizationCode,
          reference: reference || PaystackService.generateTransactionRef(),
        }),
      });

      const result = await response.json();

      if (result.status) {
        return {
          status: 'success',
          message: 'Payment charged successfully',
          data: result.data,
        };
      } else {
        return {
          status: 'error',
          message: result.message || 'Failed to charge card',
          data: result,
        };
      }
    } catch (error: any) {
      return {
        status: 'error',
        message: error.message || 'Network error',
      };
    }
  },

  /**
   * Generate transaction reference
   * Use this to create unique transaction IDs
   */
  generateTransactionRef: (): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    return `CB-${timestamp}-${random}`;
  },

  /**
   * Get Paystack public key for frontend
   */
  getPublicKey: (): string => {
    return PAYSTACK_PUBLIC_KEY;
  },

  /**
   * Format amount for Paystack (in Naira, will be converted to kobo internally)
   */
  formatAmount: (amount: number): number => {
    return parseFloat(amount.toFixed(2));
  },

  /**
   * Convert amount from kobo to naira
   */
  fromKobo: (amount: number): number => {
    return amount / 100;
  },

  /**
   * Convert amount from naira to kobo
   */
  toKobo: (amount: number): number => {
    return amount * 100;
  },
};

/**
 * Paystack Payment Hook for React Native
 * Use react-native-paystack-webview package for mobile payments
 * 
 * Installation:
 * npm install react-native-paystack-webview
 * 
 * Usage Example:
 * 
 * import { Paystack } from 'react-native-paystack-webview';
 * import { PaystackService } from '@/apiServices/paystackService';
 * 
 * const paystackWebViewRef = useRef();
 * 
 * <Paystack
 *   paystackKey={PaystackService.getPublicKey()}
 *   amount={PaystackService.toKobo(totalAmount)}
 *   billingEmail="customer@email.com"
 *   billingName="John Doe"
 *   billingMobile="08012345678"
 *   activityIndicatorColor="#00A86B"
 *   onCancel={(e) => {
 *     console.log('Payment cancelled', e);
 *   }}
 *   onSuccess={(res) => {
 *     console.log('Payment success', res);
 *     // Verify payment with reference
 *     PaystackService.verifyPayment(res.reference).then(result => {
 *       if (result.status === 'success') {
 *         // Payment confirmed
 *       }
 *     });
 *   }}
 *   ref={paystackWebViewRef}
 * />
 */

export default PaystackService;

