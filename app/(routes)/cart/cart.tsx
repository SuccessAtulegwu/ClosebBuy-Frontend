import React, { useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '@/context/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
} from '@/redux/slices/cartSlice';
import { fontFamilies } from '@/constants/app.constants';

export default function CartScreen() {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { items, totalAmount, totalItems } = useAppSelector((state) => state.cart);

  const handleIncrement = (id: number) => {
    dispatch(incrementQuantity(id));
  };

  const handleDecrement = (id: number) => {
    dispatch(decrementQuantity(id));
  };

  const handleRemove = (id: number, name: string) => {
    Alert.alert(
      'Remove Item',
      `Remove ${name} from cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => dispatch(removeFromCart(id)),
        },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Remove all items from cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => dispatch(clearCart()),
        },
      ]
    );
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to cart before checkout');
      return;
    }
    router.push('/(routes)/cart/shipping');
  };

  const renderCartItem = ({ item }: any) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.itemPrice}>₦{item.price.toLocaleString()}</Text>
        
        {!item.inStock && (
          <Text style={styles.outOfStock}>Out of Stock</Text>
        )}
      </View>

      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleDecrement(item.id)}
        >
          <Ionicons name="remove" size={20} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.quantityText}>{item.quantity}</Text>
        
        <TouchableOpacity
          style={[styles.quantityButton, styles.addButton]}
          onPress={() => handleIncrement(item.id)}
        >
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemove(item.id, item.name)}
      >
        <Ionicons name="trash-outline" size={20} color="#ff4757" />
      </TouchableOpacity>
    </View>
  );

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={100} color={theme.tabIconDefault} />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyText}>Add items to get started</Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => router.back()}
        >
          <Text style={styles.shopButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Cart Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </Text>
          <TouchableOpacity onPress={handleClearCart}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        </View>

        {/* Cart Items */}
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCartItem}
          scrollEnabled={false}
          contentContainerStyle={styles.listContainer}
        />

        {/* Summary Section */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal ({totalItems} items)</Text>
            <Text style={styles.summaryValue}>₦{totalAmount.toLocaleString()}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₦{totalAmount.toLocaleString()}</Text>
          </View>
          
          <Text style={styles.shippingNote}>
            *Delivery fees and taxes will be calculated at checkout
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Checkout Button */}
      <View style={styles.bottomContainer}>
        <View style={styles.bottomLeft}>
          <Text style={styles.bottomLabel}>Total</Text>
          <Text style={styles.bottomTotal}>₦{totalAmount.toLocaleString()}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollView: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      paddingBottom: 10,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      fontFamily: fontFamilies.NunitoBold,
    },
    clearText: {
      fontSize: 14,
      color: '#ff4757',
      fontFamily: fontFamilies.NunitoSemiBold,
    },
    listContainer: {
      paddingHorizontal: 20,
    },
    cartItem: {
      flexDirection: 'row',
      backgroundColor: theme.cardcolor,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    itemImage: {
      width: 80,
      height: 80,
      borderRadius: 8,
      marginRight: 12,
    },
    itemDetails: {
      flex: 1,
      justifyContent: 'center',
    },
    itemName: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
      fontFamily: fontFamilies.NunitoSemiBold,
    },
    itemPrice: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.accent,
      fontFamily: fontFamilies.NunitoBold,
    },
    outOfStock: {
      fontSize: 12,
      color: '#ff4757',
      marginTop: 4,
      fontFamily: fontFamilies.NunitoRegular,
    },
    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 8,
    },
    quantityButton: {
      backgroundColor: '#ff4757',
      borderRadius: 6,
      width: 28,
      height: 28,
      justifyContent: 'center',
      alignItems: 'center',
    },
    addButton: {
      backgroundColor: '#5cb85c',
    },
    quantityText: {
      marginHorizontal: 12,
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      minWidth: 20,
      textAlign: 'center',
      fontFamily: fontFamilies.NunitoSemiBold,
    },
    removeButton: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 8,
    },
    summaryContainer: {
      backgroundColor: theme.cardcolor,
      borderRadius: 12,
      padding: 20,
      margin: 20,
      marginTop: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    summaryTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
      fontFamily: fontFamilies.NunitoBold,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    summaryLabel: {
      fontSize: 14,
      color: theme.tabIconDefault,
      fontFamily: fontFamilies.NunitoRegular,
    },
    summaryValue: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      fontFamily: fontFamilies.NunitoSemiBold,
    },
    divider: {
      height: 1,
      backgroundColor: theme.tabIconDefault + '30',
      marginVertical: 12,
    },
    totalRow: {
      marginBottom: 8,
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      fontFamily: fontFamilies.NunitoBold,
    },
    totalValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.accent,
      fontFamily: fontFamilies.NunitoBold,
    },
    shippingNote: {
      fontSize: 12,
      color: theme.tabIconDefault,
      fontStyle: 'italic',
      marginTop: 8,
      fontFamily: fontFamilies.NunitoRegular,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
      padding: 40,
    },
    emptyTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginTop: 20,
      fontFamily: fontFamilies.NunitoBold,
    },
    emptyText: {
      fontSize: 16,
      color: theme.tabIconDefault,
      marginTop: 8,
      fontFamily: fontFamilies.NunitoRegular,
    },
    shopButton: {
      backgroundColor: theme.accent,
      paddingHorizontal: 30,
      paddingVertical: 14,
      borderRadius: 25,
      marginTop: 30,
    },
    shopButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      fontFamily: fontFamilies.NunitoSemiBold,
    },
    bottomContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.cardcolor,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: theme.tabIconDefault + '20',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 10,
    },
    bottomLeft: {
      flex: 1,
    },
    bottomLabel: {
      fontSize: 12,
      color: theme.tabIconDefault,
      fontFamily: fontFamilies.NunitoRegular,
    },
    bottomTotal: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      fontFamily: fontFamilies.NunitoBold,
    },
    checkoutButton: {
      flexDirection: 'row',
      backgroundColor: theme.accent,
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: 25,
      alignItems: 'center',
      gap: 8,
    },
    checkoutText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      fontFamily: fontFamilies.NunitoSemiBold,
    },
  });
}

