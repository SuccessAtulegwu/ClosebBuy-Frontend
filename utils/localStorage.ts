// Local Storage Service for User Data
// Saves data locally on the device using AsyncStorage

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeliveryDetail } from '@/types/publicTypes';
import { PaymentMethod as PaymentMethodEnum } from '@/types/publicenums';

const STORAGE_KEYS = {
  SAVED_ADDRESSES: '@closebuy_saved_addresses',
  SAVED_PAYMENT_METHODS: '@closebuy_saved_payment_methods',
  DEFAULT_ADDRESS: '@closebuy_default_address',
  DEFAULT_PAYMENT: '@closebuy_default_payment',
};

export interface SavedAddress extends Omit<DeliveryDetail, 'id' | 'userId' | 'user' | 'orders'> {
  id: string;
  isDefault?: boolean;
  createdAt: string;
}

export interface SavedPaymentMethod {
  id: string;
  type: PaymentMethodEnum;
  cardNumber?: string; // Last 4 digits only
  cardHolderName?: string;
  expiryDate?: string;
  isDefault?: boolean;
  createdAt: string;
}

export const LocalStorageService = {
  // ============ ADDRESS METHODS ============

  /**
   * Save a new address to local storage
   */
  saveAddress: async (address: Omit<SavedAddress, 'id' | 'createdAt'>): Promise<SavedAddress> => {
    try {
      const addresses = await LocalStorageService.getSavedAddresses();
      
      const newAddress: SavedAddress = {
        ...address,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      // If this is default, unset other defaults
      if (newAddress.isDefault) {
        addresses.forEach(addr => addr.isDefault = false);
      }

      addresses.push(newAddress);
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.SAVED_ADDRESSES,
        JSON.stringify(addresses)
      );

      return newAddress;
    } catch (error) {
      console.error('Error saving address:', error);
      throw error;
    }
  },

  /**
   * Get all saved addresses from local storage
   */
  getSavedAddresses: async (): Promise<SavedAddress[]> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_ADDRESSES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting addresses:', error);
      return [];
    }
  },

  /**
   * Get default address
   */
  getDefaultAddress: async (): Promise<SavedAddress | null> => {
    try {
      const addresses = await LocalStorageService.getSavedAddresses();
      return addresses.find(addr => addr.isDefault) || null;
    } catch (error) {
      console.error('Error getting default address:', error);
      return null;
    }
  },

  /**
   * Update an existing address
   */
  updateAddress: async (id: string, updates: Partial<SavedAddress>): Promise<void> => {
    try {
      const addresses = await LocalStorageService.getSavedAddresses();
      const index = addresses.findIndex(addr => addr.id === id);
      
      if (index !== -1) {
        // If setting as default, unset others
        if (updates.isDefault) {
          addresses.forEach(addr => addr.isDefault = false);
        }
        
        addresses[index] = { ...addresses[index], ...updates };
        
        await AsyncStorage.setItem(
          STORAGE_KEYS.SAVED_ADDRESSES,
          JSON.stringify(addresses)
        );
      }
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  },

  /**
   * Delete an address
   */
  deleteAddress: async (id: string): Promise<void> => {
    try {
      const addresses = await LocalStorageService.getSavedAddresses();
      const filtered = addresses.filter(addr => addr.id !== id);
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.SAVED_ADDRESSES,
        JSON.stringify(filtered)
      );
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  },

  // ============ PAYMENT METHODS ============

  /**
   * Save a new payment method to local storage
   */
  savePaymentMethod: async (
    payment: Omit<SavedPaymentMethod, 'id' | 'createdAt'>
  ): Promise<SavedPaymentMethod> => {
    try {
      const methods = await LocalStorageService.getSavedPaymentMethods();
      
      const newPayment: SavedPaymentMethod = {
        ...payment,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      // If this is default, unset other defaults
      if (newPayment.isDefault) {
        methods.forEach(method => method.isDefault = false);
      }

      methods.push(newPayment);
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.SAVED_PAYMENT_METHODS,
        JSON.stringify(methods)
      );

      return newPayment;
    } catch (error) {
      console.error('Error saving payment method:', error);
      throw error;
    }
  },

  /**
   * Get all saved payment methods from local storage
   */
  getSavedPaymentMethods: async (): Promise<SavedPaymentMethod[]> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_PAYMENT_METHODS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting payment methods:', error);
      return [];
    }
  },

  /**
   * Get default payment method
   */
  getDefaultPaymentMethod: async (): Promise<SavedPaymentMethod | null> => {
    try {
      const methods = await LocalStorageService.getSavedPaymentMethods();
      return methods.find(method => method.isDefault) || null;
    } catch (error) {
      console.error('Error getting default payment method:', error);
      return null;
    }
  },

  /**
   * Delete a payment method
   */
  deletePaymentMethod: async (id: string): Promise<void> => {
    try {
      const methods = await LocalStorageService.getSavedPaymentMethods();
      const filtered = methods.filter(method => method.id !== id);
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.SAVED_PAYMENT_METHODS,
        JSON.stringify(filtered)
      );
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  },

  // ============ UTILITY METHODS ============

  /**
   * Clear all saved data (useful for logout)
   */
  clearAllData: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.SAVED_ADDRESSES,
        STORAGE_KEYS.SAVED_PAYMENT_METHODS,
        STORAGE_KEYS.DEFAULT_ADDRESS,
        STORAGE_KEYS.DEFAULT_PAYMENT,
      ]);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  },

  /**
   * Get storage info (for debugging)
   */
  getStorageInfo: async () => {
    try {
      const addresses = await LocalStorageService.getSavedAddresses();
      const payments = await LocalStorageService.getSavedPaymentMethods();
      
      return {
        addressCount: addresses.length,
        paymentCount: payments.length,
        addresses,
        payments,
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return null;
    }
  },
};

export default LocalStorageService;

