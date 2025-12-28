import { Alert, Linking, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { ThemeContext } from '@/context/ThemeContext';
import { Stack, useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { IsIOS } from '@/constants/app.constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function OrderDetailsScreen() {
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const router = useRouter();
    const inset = useSafeAreaInsets();
    const [currentStatus, setCurrentStatus] = useState('ORDER_ASSIGNED');
    const [showStatusModal, setShowStatusModal] = useState(false);
    const ORDER_STATUSES = {
        PENDING: 'PENDING',
        PAID: 'PAID',
        SHIPPED: 'SHIPPED',
        COMPLETED: 'COMPLETED',
        CANCELED: 'CANCELED',
        CONFIRMED: 'CONFIRMED',
        IN_PROGRESS: 'IN_PROGRESS',
        DELIVERED: 'DELIVERED',
        ORDER_PLACED: 'ORDER_PLACED',
        ORDER_ASSIGNED: 'ORDER_ASSIGNED',
        AWAITING_RIDER_ACK: 'AWAITING_RIDER_ACK',
    };

    const handleStatusUpdate = (newStatus: any) => {
        Alert.alert(
            'Update Order Status',
            `Are you sure you want to change the status to ${formatStatusText(newStatus)}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Update',
                    onPress: () => {
                        setCurrentStatus(newStatus);
                        setShowStatusModal(false);
                        // Here you would typically make an API call to update the status
                        console.log(`Status updated to: ${newStatus}`);
                    }
                }
            ]
        );
    };

    const getStatusColor = (status: any) => {
        switch (status) {
            case ORDER_STATUSES.PENDING:
            case ORDER_STATUSES.ORDER_PLACED:
                return '#F59E0B'; // Amber
            case ORDER_STATUSES.PAID:
            case ORDER_STATUSES.CONFIRMED:
                return '#3B82F6'; // Blue
            case ORDER_STATUSES.SHIPPED:
            case ORDER_STATUSES.IN_PROGRESS:
            case ORDER_STATUSES.ORDER_ASSIGNED:
                return '#8B5CF6'; // Purple
            case ORDER_STATUSES.COMPLETED:
            case ORDER_STATUSES.DELIVERED:
                return '#10B981'; // Green
            case ORDER_STATUSES.CANCELED:
                return '#EF4444'; // Red
            case ORDER_STATUSES.AWAITING_RIDER_ACK:
                return '#F97316'; // Orange
            default:
                return '#6B7280'; // Gray
        }
    };

    const getStatusStyle = (status: any) => {
        const color = getStatusColor(status);
        return {
            backgroundColor: `${color}20`, // Add transparency
            borderColor: color,
            borderWidth: 1,
        };
    };

    const getStatusTextStyle = (status: any) => {
        return {
            color: getStatusColor(status),
        };
    };

    const formatStatusText = (status: any) => {
        return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l: any) => l.toUpperCase());
    };



    const orderData = {
        orderId: 'D4U-2929',
        orderDate: 'Jan 5 2021 08:22',
        status: currentStatus,
        pickupLocation: {
            address: '18A Oba Elegushi Road, Ikoyi, Lagos Nigeria',
        },
        dropoffLocation: {
            address: 'Landmark Towers Cntr, Victoria Island, Lagos Nigeria',
        },
        sender: {
            name: 'Bukayo Saka',
            phone: '+234901234567'
        },
        receiver: {
            name: 'Kelechi Okafor',
            phone: '+234907654321'
        },
        orderDetails: {
            itemName: 'File',
            itemType: 'Document',
            priority: 'Shatter resistant'
        }
    };

    const handleCallSender = () => {
        Linking.openURL(`tel:${orderData.sender.phone}`);
    };

    const handleCallReceiver = () => {
        Linking.openURL(`tel:${orderData.receiver.phone}`);
    };

    /*   const getStatusStyle = (status: any) => {
          return status === 'Picked Up' ? styles.statusPickedUp : styles.statusDefault;
      }; */

    return (
        <>
            <Stack.Screen options={{
                headerShown: true, header: () => <ThemedView style={{ paddingTop: inset.top + 20, paddingBottom: 20,borderBottomWidth:3, borderColor:theme.background_input, backgroundColor: theme.background, }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, paddingHorizontal: 20, justifyContent: 'flex-start' }}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name={IsIOS ? 'chevron-back-sharp' : 'arrow-back-sharp'} size={24} color={theme.text} />
                        </TouchableOpacity>
                        <ThemedText>Order Details</ThemedText>
                    </View>
                </ThemedView>
            }} />
            <ThemedView style={styles.container}>
                <ScrollView style={styles.content}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: IsIOS ? 30 : 100 }}>
                    {/* Header */}
                    <ThemedView style={styles.header}>
                        <ThemedText style={styles.orderId}>Order ID: {orderData.orderId}</ThemedText>
                        <ThemedView>
                          <ThemedText style={[styles.statusText, getStatusTextStyle(orderData.status),{borderColor:getStatusColor(orderData.status)}]}>
                                 {formatStatusText(orderData.status)}
                                </ThemedText>
                        </ThemedView>
                    </ThemedView>
                    <ThemedText style={styles.orderDate}>{orderData.orderDate}</ThemedText>

                    {/* Location Section */}
                    <ThemedView style={styles.locationSection}>
                        <ThemedText style={styles.sectionTitle}>Pickup Location</ThemedText>
                        <ThemedView style={styles.locationCard}>
                            <ThemedView style={styles.locationIcon}>
                                <Ionicons name="location" size={20} color="#10B981" />
                            </ThemedView>
                            <ThemedText style={styles.locationText}>{orderData.pickupLocation.address}</ThemedText>
                        </ThemedView>

                        <ThemedText style={styles.sectionTitle}>Drop off Location</ThemedText>
                        <ThemedView style={styles.locationCard}>
                            <ThemedView style={styles.locationIcon}>
                                <Ionicons name="location" size={20} color="#F59E0B" />
                            </ThemedView>
                            <ThemedText style={styles.locationText}>{orderData.dropoffLocation.address}</ThemedText>
                        </ThemedView>
                    </ThemedView>

                    {/* Order Details */}
                    <ThemedView style={styles.orderDetailsSection}>
                        <ThemedText style={styles.sectionTitle}>Order Details</ThemedText>

                        <View style={styles.detailRow}>
                            <ThemedText style={styles.detailLabel}>Item name</ThemedText>
                            <ThemedText style={styles.detailValue}>{orderData.orderDetails.itemName}</ThemedText>
                        </View>

                        <View style={styles.detailRow}>
                            <ThemedText style={styles.detailLabel}>Item type</ThemedText>
                            <ThemedText style={styles.detailValue}>{orderData.orderDetails.itemType}</ThemedText>
                        </View>

                        <View style={styles.detailRow}>
                            <ThemedText style={styles.detailLabel}>Priority</ThemedText>
                            <ThemedText style={styles.detailValue}>{orderData.orderDetails.priority}</ThemedText>
                        </View>
                    </ThemedView>
                </ScrollView>
            </ThemedView>
        </>

    )
}


function getStyles(theme: any) {
    return StyleSheet.create({
        container: {
            flex: 1,
            //backgroundColor: '#4A5568',
        },
        content: {
            flex: 1,
            paddingHorizontal: 20,
            paddingTop: 20,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        orderId: {
            fontSize: 18,
            fontWeight: '600',
        },
        orderDate: {
            fontSize: 14,
            marginBottom: 24,
        },
        statusBadge: {
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 5,
        },
        statusPickedUp: {
            backgroundColor: '#9AE6B4',
        },
        statusDefault: {
            backgroundColor: '#E5E7EB',
        },
        statusText: {
            fontSize: 12,
            fontWeight: '600',
            borderWidth:1,
            borderRadius:10,
            paddingVertical:5,
            paddingHorizontal: 10

        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: '500',
            marginBottom: 12,
            marginTop: 16,
        },
        locationSection: {
            marginBottom: 16,
        },
        locationCard: {
            backgroundColor: theme.background_input,
            borderRadius: 12,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
        },
        locationIcon: {
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: '#e7eee9ff',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
            elevation:10
        },
        locationText: {
            flex: 1,
            fontSize: 14,
            color: '#1F2937',
            lineHeight: 20,
        },
        orderDetailsSection: {
            backgroundColor: theme.background_input,
            borderRadius: 12,
            padding: 16,
            marginTop: 8,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
        },
        detailRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 8,
            borderBottomWidth: 1,
            borderBottomColor: '#F3F4F6',
        },
        detailLabel: {
            fontSize: 14,
            color: '#6B7280',
        },
        detailValue: {
            fontSize: 14,
            color: '#1F2937',
            fontWeight: '500',
        },
       
        contactCard: {
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            padding: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
        },
    })
}