// Example component showing how to use the custom alert system
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { alertService } from '@/utils/alertService';
import { useRouter } from 'expo-router';

export function AlertExamplesScreen() {
  const router = useRouter();

  // Example 1: Simple success alert
  const showSuccessAlert = () => {
    alertService.success(
      'Success!',
      'Your order has been placed successfully.'
    );
  };

  // Example 2: Error alert with backend error
  const showErrorAlert = () => {
    // Simulating a backend error
    const backendError = {
      response: {
        data: {
          message: 'Invalid email or password. Please try again.',
        },
      },
    };
    alertService.error('Login Failed', backendError);
  };

  // Example 3: Warning alert
  const showWarningAlert = () => {
    alertService.warning(
      'Low Stock',
      'Only 2 items left in stock. Order soon!'
    );
  };

  // Example 4: Info alert
  const showInfoAlert = () => {
    alertService.info(
      'Delivery Update',
      'Your order will be delivered between 2-4 PM today.'
    );
  };

  // Example 5: Alert with custom button
  const showAlertWithCustomButton = () => {
    alertService.success(
      'Profile Updated',
      'Your profile has been updated successfully!',
      [
        {
          text: 'View Profile',
          style: 'default',
          onPress: () => router.push('/(tabs)/profile'),
        },
      ]
    );
  };

  // Example 6: Confirmation dialog
  const showConfirmationDialog = () => {
    alertService.confirm(
      'Delete Item',
      'Are you sure you want to remove this item from your cart?',
      () => {
        // User confirmed
        alertService.success('Removed', 'Item removed from cart');
      },
      () => {
        // User cancelled
        console.log('Deletion cancelled');
      },
      'Remove',
      'Cancel'
    );
  };

  // Example 7: Multiple buttons
  const showMultipleButtons = () => {
    alertService.show({
      type: 'warning',
      title: 'Unsaved Changes',
      message: 'You have unsaved changes. What would you like to do?',
      buttons: [
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => router.back(),
        },
        {
          text: 'Save',
          style: 'default',
          onPress: () => {
            // Save changes
            alertService.success('Saved', 'Changes saved successfully');
          },
        },
      ],
    });
  };

  // Example 8: Firebase error
  const showFirebaseError = () => {
    const firebaseError = {
      code: 'auth/email-already-in-use',
    };
    alertService.error('Sign Up Failed', firebaseError);
  };

  // Example 9: Network error
  const showNetworkError = () => {
    const networkError = {
      request: {},
      // No response means network error
    };
    alertService.error('Connection Error', networkError);
  };

  // Example 10: Validation errors (array)
  const showValidationErrors = () => {
    const validationError = {
      response: {
        data: {
          errors: [
            'Email is required',
            'Password must be at least 6 characters',
            'Name cannot be empty',
          ],
        },
      },
    };
    alertService.error('Validation Failed', validationError);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Custom Alert Examples</Text>

      <TouchableOpacity style={styles.button} onPress={showSuccessAlert}>
        <Text style={styles.buttonText}>Success Alert</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={showErrorAlert}>
        <Text style={styles.buttonText}>Error Alert</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={showWarningAlert}>
        <Text style={styles.buttonText}>Warning Alert</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={showInfoAlert}>
        <Text style={styles.buttonText}>Info Alert</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={showAlertWithCustomButton}>
        <Text style={styles.buttonText}>Custom Button Alert</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={showConfirmationDialog}>
        <Text style={styles.buttonText}>Confirmation Dialog</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={showMultipleButtons}>
        <Text style={styles.buttonText}>Multiple Buttons</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={showFirebaseError}>
        <Text style={styles.buttonText}>Firebase Error</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={showNetworkError}>
        <Text style={styles.buttonText}>Network Error</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={showValidationErrors}>
        <Text style={styles.buttonText}>Validation Errors</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

