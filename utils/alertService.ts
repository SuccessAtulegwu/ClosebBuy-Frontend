export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface ShowAlertOptions {
  type?: AlertType;
  title: string;
  message: string;
  buttons?: AlertButton[];
}

// Simple EventEmitter for React Native
class SimpleEventEmitter {
  private listeners: { [event: string]: Function[] } = {};

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Function) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  emit(event: string, ...args: any[]) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => callback(...args));
  }
}

class AlertService extends SimpleEventEmitter {
  show(options: ShowAlertOptions) {
    this.emit('show', options);
  }

  hide() {
    this.emit('hide');
  }

  /**
   * Show a success alert
   */
  success(title: string, message: string, buttons?: AlertButton[]) {
    this.show({
      type: 'success',
      title,
      message,
      buttons: buttons || [{ text: 'OK', style: 'default' }],
    });
  }

  /**
   * Show an error alert with formatted error message from backend
   */
  error(title: string, error: any, buttons?: AlertButton[]) {
    const message = this.formatErrorMessage(error);
    this.show({
      type: 'error',
      title,
      message,
      buttons: buttons || [{ text: 'OK', style: 'default' }],
    });
  }

  /**
   * Show a warning alert
   */
  warning(title: string, message: string, buttons?: AlertButton[]) {
    this.show({
      type: 'warning',
      title,
      message,
      buttons: buttons || [{ text: 'OK', style: 'default' }],
    });
  }

  /**
   * Show an info alert
   */
  info(title: string, message: string, buttons?: AlertButton[]) {
    this.show({
      type: 'info',
      title,
      message,
      buttons: buttons || [{ text: 'OK', style: 'default' }],
    });
  }

  /**
   * Show a confirmation dialog
   */
  confirm(
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    confirmText: string = 'Confirm',
    cancelText: string = 'Cancel'
  ) {
    this.show({
      type: 'warning',
      title,
      message,
      buttons: [
        {
          text: cancelText,
          style: 'cancel',
          onPress: onCancel,
        },
        {
          text: confirmText,
          style: 'default',
          onPress: onConfirm,
        },
      ],
    });
  }

  /**
   * Format error messages from various sources into user-friendly messages
   */
  private formatErrorMessage(error: any): string {
    // If error is already a string
    if (typeof error === 'string') {
      return error;
    }

    // If error is an object with a message property
    if (error?.message) {
      return error.message;
    }

    // If error is an object with an error property
    if (error?.error) {
      if (typeof error.error === 'string') {
        return error.error;
      }
      if (error.error.message) {
        return error.error.message;
      }
    }

    // If error has response data (from axios or similar)
    if (error?.response?.data) {
      const data = error.response.data;
      
      // Check for common backend error formats
      if (data.message) {
        return data.message;
      }
      
      if (data.error) {
        if (typeof data.error === 'string') {
          return data.error;
        }
        if (data.error.message) {
          return data.error.message;
        }
      }

      // If data has validation errors (array of errors)
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        return data.errors.map((err: any) => {
          if (typeof err === 'string') return err;
          if (err.message) return err.message;
          if (err.msg) return err.msg;
          return JSON.stringify(err);
        }).join('\n');
      }

      // If data itself is a string
      if (typeof data === 'string') {
        return data;
      }
    }

    // Handle Firebase errors
    if (error?.code) {
      return this.formatFirebaseError(error.code);
    }

    // Handle network errors
    if (error?.request && !error?.response) {
      return 'Network error. Please check your internet connection and try again.';
    }

    // Default error message
    return 'An unexpected error occurred. Please try again later.';
  }

  /**
   * Format Firebase-specific error codes into user-friendly messages
   */
  private formatFirebaseError(code: string): string {
    const firebaseErrors: { [key: string]: string } = {
      'auth/email-already-in-use': 'This email is already registered. Please login or use a different email.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/operation-not-allowed': 'This operation is not allowed. Please contact support.',
      'auth/weak-password': 'Password is too weak. Please use a stronger password.',
      'auth/user-disabled': 'This account has been disabled. Please contact support.',
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/invalid-credential': 'Invalid email or password. Please check and try again.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection and try again.',
      'auth/requires-recent-login': 'Please login again to complete this action.',
      'auth/expired-action-code': 'This link has expired. Please request a new one.',
      'auth/invalid-action-code': 'This link is invalid. Please request a new one.',
    };

    return firebaseErrors[code] || 'An authentication error occurred. Please try again.';
  }
}

// Export singleton instance
export const alertService = new AlertService();

