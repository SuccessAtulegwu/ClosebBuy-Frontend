import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IsIOS } from '@/constants/app.constants';
import { useRouter } from 'expo-router';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

const newOrders = [
    {
        id: 'D4U-29320',
        status: 'Pending',
        items: 5,
        total: 15750,
        address: '32 Admiralty Way, Lekki Phase 1...',
        landmark: 'Mega Plaza, Lekki...',
        date: '26 Dec, 2024',
        time: '10:30 AM'
    },
    {
        id: 'D4U-29319',
        status: 'Processing',
        items: 3,
        total: 8900,
        address: '18 Adeola Odeku Street, V.I...',
        landmark: 'Silverbird Galleria, Victoria Island...',
        date: '26 Dec, 2024',
        time: '9:15 AM'
    },
    {
        id: 'D4U-29318',
        status: 'Confirmed',
        items: 7,
        total: 22340,
        address: '5 Bisola Durosinmi-Etti Drive...',
        landmark: 'Maryland Mall, Ikeja...',
        date: '26 Dec, 2024',
        time: '8:45 AM'
    },
    {
        id: 'D4U-29317',
        status: 'Pending',
        items: 2,
        total: 5600,
        address: '12 Akin Adesola Street...',
        landmark: 'Eko Hotel, Victoria Island...',
        date: '25 Dec, 2024',
        time: '6:30 PM'
    }
];

const NewOrders = () => {
    const router = useRouter();
    
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Pending':
                return styles.statusPending;
            case 'Processing':
                return styles.statusProcessing;
            case 'Confirmed':
                return styles.statusConfirmed;
            default:
                return styles.statusDefault;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending':
                return '#F59E0B';
            case 'Processing':
                return '#3B82F6';
            case 'Confirmed':
                return '#10B981';
            default:
                return '#6B7280';
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView 
                style={styles.ordersList}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: IsIOS ? 100 : 80 }}
            >
                {newOrders.map((order) => (
                    <TouchableOpacity 
                        key={order.id} 
                        style={styles.orderCard} 
                        onPress={() => router.push('/(routes)/order/orderdetailsscreen')}
                    >
                        <View style={styles.orderHeader}>
                            <View>
                                <Text style={{ color: '#718096', fontSize: 12, marginBottom: 4 }}>Order ID</Text>
                                <Text style={styles.orderId}>{order.id}</Text>
                            </View>
                            <View style={[styles.statusBadge, getStatusStyle(order.status)]}>
                                <View style={[styles.statusDot, { backgroundColor: getStatusColor(order.status) }]} />
                                <Text style={styles.statusText}>
                                    {order.status}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.orderDetails}>
                            <View style={styles.detailRow}>
                                <Ionicons name="cube-outline" size={16} color="#666" />
                                <Text style={styles.detailText}>{order.items} items</Text>
                                <View style={styles.priceContainer}>
                                    <Text style={styles.priceText}>₦{order.total.toLocaleString()}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.locationInfo}>
                            <View style={styles.locationRow}>
                                <Ionicons name="location-outline" size={16} color="#666" />
                                <Text style={styles.addressText}>{order.address}</Text>
                            </View>
                            <View style={styles.locationRow}>
                                <Ionicons name="business-outline" size={16} color="#666" />
                                <Text style={styles.landmarkText}>{order.landmark}</Text>
                            </View>
                        </View>

                        <View style={styles.orderFooter}>
                            <View style={styles.dateTimeContainer}>
                                <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
                                <Text style={styles.dateText}>{order.date}</Text>
                                <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                                <Text style={styles.timeText}>{order.time}</Text>
                            </View>
                            <TouchableOpacity style={styles.actionButton}>
                                <Text style={styles.actionButtonText}>View Details</Text>
                                <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    header: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        marginLeft: 5
    },
    ordersList: {
        flex: 1,
    },
    orderCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderColor: '#E2E8F0',
        borderWidth: 1,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 10,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 8
    },
    orderId: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A202C',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        gap: 6,
    },
    statusPending: {
        backgroundColor: '#FEF3C7',
        borderWidth: 1,
        borderColor: '#F59E0B',
    },
    statusProcessing: {
        backgroundColor: '#DBEAFE',
        borderWidth: 1,
        borderColor: '#3B82F6',
    },
    statusConfirmed: {
        backgroundColor: '#D1FAE5',
        borderWidth: 1,
        borderColor: '#10B981',
    },
    statusDefault: {
        backgroundColor: '#E5E7EB',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1A202C',
    },
    orderDetails: {
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        fontSize: 14,
        color: '#4B5563',
        fontWeight: '500',
    },
    priceContainer: {
        marginLeft: 'auto',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 6,
    },
    priceText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
    },
    locationInfo: {
        gap: 8,
        marginBottom: 12,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    addressText: {
        fontSize: 14,
        color: '#2D3748',
        flex: 1,
    },
    landmarkText: {
        fontSize: 14,
        color: '#718096',
        flex: 1,
    },
    orderFooter: {
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dateText: {
        fontSize: 12,
        color: '#6B7280',
        marginRight: 12,
    },
    timeText: {
        fontSize: 12,
        color: '#6B7280',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    actionButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#3B82F6',
    },
});

export default NewOrders;

