import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IsIOS } from '@/constants/app.constants';
import { useRouter } from 'expo-router';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

const historyOrders = [
    {
        id: 'D4U-29315',
        status: 'Delivered',
        address: '18A Oba Elegushi Road, Ikoyi...',
        landmark: 'Landmark Towers Cntr., Victor...',
        date: '12 Sep, 2024',
        time: '2:45 PM'
    },
    {
        id: 'D4U-29301',
        status: 'Delivered',
        address: '25 Admiralty Way, Lekki Phase 1...',
        landmark: 'Palms Shopping Mall, Lekki...',
        date: '10 Sep, 2024',
        time: '11:30 AM'
    },
    {
        id: 'D4U-29289',
        status: 'Cancelled',
        address: '15 Ozumba Mbadiwe Avenue...',
        landmark: 'Victoria Island, Lagos...',
        date: '8 Sep, 2024',
        time: '4:20 PM'
    },
    {
        id: 'D4U-29275',
        status: 'Delivered',
        address: '42 Ajose Adeogun Street...',
        landmark: 'Four Points Hotel, Victoria Island...',
        date: '5 Sep, 2024',
        time: '1:15 PM'
    }
];

const OrderHistory = () => {
    const router = useRouter();
    const getStatusStyle = (status: any) => {
        switch (status) {
            case 'Delivered':
                return styles.statusDelivered;
            case 'Cancelled':
                return styles.statusCancelled;
            default:
                return styles.statusDefault;
        }
    };

    const getStatusTextStyle = (status: any) => {
        return status === 'Cancelled' ? styles.statusTextWhite : styles.statusTextDark;
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedText style={styles.header}>Order History</ThemedText>

            <ScrollView style={styles.ordersList}
             showsVerticalScrollIndicator={false}
             contentContainerStyle={{ paddingBottom: IsIOS ? 100 : 80 }}
             >
                {historyOrders.map((order) => (
                    <TouchableOpacity key={order.id} style={styles.orderCard} onPress={() => router.push('/(routes)/order/orderdetailsscreen')}>
                        <View style={styles.orderHeader}>
                            <View>
                                <Text style={{ color: '#718096', fontSize: 12, marginBottom: 4 }}>Order ID</Text>
                                <Text style={styles.orderId}>{order.id}</Text>
                            </View>
                            <View style={[styles.statusBadge, getStatusStyle(order.status)]}>
                                <Text style={[styles.statusText, getStatusTextStyle(order.status)]}>
                                    {order.status}
                                </Text>
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
        backgroundColor: '#4A5568',
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    header: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        marginLeft:5
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
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 5,
    },
    statusDelivered: {
        backgroundColor: '#D4F8E8',
        borderWidth: 1,
        borderColor: '#10B981',
    },
    statusCancelled: {
        backgroundColor: '#EF4444',
    },
    statusDefault: {
        backgroundColor: '#E5E7EB',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    statusTextDark: {
        color: '#1A202C',
    },
    statusTextWhite: {
        color: '#FFFFFF',
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
});

export default OrderHistory;