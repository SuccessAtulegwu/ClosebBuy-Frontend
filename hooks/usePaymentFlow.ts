// Custom Hook for Complete Payment Flow
// Handles: Order Creation → Payment Initialization → Payment Processing → Verification

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearCart } from '@/redux/slices/cartSlice';
import { clearCurrentOrder } from '@/redux/slices/orderSlice';
import { OrderService } from '@/apiServices/orderService';
import { SecurePaymentService } from '@/apiServices/securePaymentService';
import { CreateOrderDto, OrderItemDto, CreateDeliveryDetailDto } from '@/types/publicDTOTypes';
import { OrderStatus, PaymentStatus, PaymentMethod as PaymentMethodEnum } from '@/types/publicenums';
import { useRouter } from 'expo-router';

interface PaymentFlowResult {
  success: boolean;
  orderId?: number;
  orderNumber?: string;
  reference?: string;
  error?: string;
}

export function usePaymentFlow() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const { items, totalAmount } = useAppSelector((state) => state.cart);
  const { shippingAddress, paymentMethod, deliveryFee, tax } = useAppSelector(
    (state) => state.order
  );
  const { user, token } = useAppSelector((state) => state.auth);

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');

  /**
   * Complete checkout flow:
   * 1. Create order in backend (status: PENDING)
   * 2. Initialize payment with Paystack
   * 3. Process payment
   * 4. Verify payment
   * 5. Update order status
   * 6. Navigate to success
   */
  const processCheckout = useCallback(
    async (): Promise<PaymentFlowResult> => {
      if (!shippingAddress || !paymentMethod || !user || !token) {
        return {
          success: false,
          error: 'Missing required information',
        };
      }

      setIsProcessing(true);

      try {
        // Step 1: Create Order in Backend
        setCurrentStep('Creating order...');
        
        const orderNumber = `HM${Date.now()}`;
        const subtotal = totalAmount;
        const total = subtotal + deliveryFee + tax;

        // Map cart items to order items
        const orderItems: OrderItemDto[] = items.map((item) => ({
          productId: item.id,
          vendorId: item.vendorId || 1, // Use vendorId from product, default to 1 if not available
          quantity: item.quantity,
          unitPrice: item.price,
        }));

        // Prepare delivery details
        const deliveryDetails: CreateDeliveryDetailDto = {
          userId: user.id,
          address: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          phoneNumber: shippingAddress.phoneNumber,
          landmark: shippingAddress.landmark,
          name: shippingAddress.name,
        };

        const orderData: CreateOrderDto = {
          orderNumber,
          customerId: user.id,
          items: orderItems,
          deliveryDetails,
          total,
          subtotal,
          deliveryFee,
          tax,
          currency: 'NGN',
          status: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          paymentMethod: paymentMethod.type,
          estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days
        };

        const orderResponse = await OrderService.createOrder(orderData);

        if (!orderResponse.success || !orderResponse.data) {
          throw new Error(orderResponse.error || 'Failed to create order');
        }

        const createdOrder = orderResponse.data;
        console.log('✅ Order created:', createdOrder.id);

        // Step 2: Initialize Payment with Paystack (via backend)
        setCurrentStep('Initializing payment...');

        const paymentInitData = {
          orderId: createdOrder.id,
          amount: total,
          email: user.email,
          phone: shippingAddress.phoneNumber,
          name: shippingAddress.name,
          metadata: {
            orderId: createdOrder.id,
            orderNumber: createdOrder.orderNumber,
            customerId: user.id,
            customerName: user.name,
            items: items.length,
          },
        };

        const initResponse = await SecurePaymentService.initializePayment(
          paymentInitData,
          token
        );

        if (!initResponse.success || !initResponse.reference) {
          throw new Error(initResponse.error || 'Failed to initialize payment');
        }

        console.log('✅ Payment initialized:', initResponse.reference);

        // Step 3: Process payment (return data for Paystack WebView)
        return {
          success: true,
          orderId: createdOrder.id,
          orderNumber: createdOrder.orderNumber,
          reference: initResponse.reference,
        };
      } catch (error: any) {
        console.error('❌ Payment flow error:', error);
        setCurrentStep('');
        return {
          success: false,
          error: error.message || 'Payment processing failed',
        };
      } finally {
        setIsProcessing(false);
      }
    },
    [items, shippingAddress, paymentMethod, user, token, totalAmount, deliveryFee, tax]
  );

  /**
   * Verify payment after Paystack returns
   * This should be called from the Paystack WebView success callback
   */
  const verifyPayment = useCallback(
    async (reference: string, orderId: number, orderNumber: string) => {
      if (!token) {
        Alert.alert('Error', 'Authentication required');
        return false;
      }

      setIsProcessing(true);
      setCurrentStep('Verifying payment...');

      try {
        const verifyResponse = await SecurePaymentService.verifyPayment(reference, token);

        if (!verifyResponse.success || verifyResponse.status !== PaymentStatus.SUCCESS) {
          throw new Error(verifyResponse.error || 'Payment verification failed');
        }

        console.log('✅ Payment verified:', reference);

        // Payment verified - clear cart and navigate to success
        dispatch(clearCart());
        dispatch(clearCurrentOrder());

        // Navigate to success screen
        router.replace({
          pathname: '/(routes)/cart/success',
          params: {
            orderId: orderId.toString(),
            orderNumber,
            reference,
          },
        });

        return true;
      } catch (error: any) {
        console.error('❌ Payment verification error:', error);
        
        Alert.alert(
          'Payment Verification Failed',
          'We could not verify your payment. Please contact support if money was deducted.',
          [
            {
              text: 'OK',
              onPress: () => {
                router.replace('/orders' as any);
              },
            },
          ]
        );

        return false;
      } finally {
        setIsProcessing(false);
        setCurrentStep('');
      }
    },
    [token, dispatch, router]
  );

  /**
   * Handle payment cancellation/failure
   */
  const handlePaymentCancel = useCallback((orderId?: number) => {
    setIsProcessing(false);
    setCurrentStep('');

    Alert.alert(
      'Payment Cancelled',
      'Your order has been saved but payment was not completed. You can retry payment from your orders.',
      [
        {
          text: 'Go to Orders',
          onPress: () => router.replace('/orders' as any),
        },
        {
          text: 'Try Again',
          onPress: () => router.back(),
        },
      ]
    );
  }, [router]);

  return {
    processCheckout,
    verifyPayment,
    handlePaymentCancel,
    isProcessing,
    currentStep,
  };
}

export default usePaymentFlow;

