import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from './ThemedView';

const ActiveOrders = ({onPress}:any) => {
    const orders = [
        {
            id: 'D4U-29320',
            status: 'New',
            address: '18A Oba Elegushi Road, Ikoyi...',
            landmark: 'Landmark Towers Cntr., Victor...'
        },
        {
            id: 'D4U-23324',
            status: 'Picked Up',
            address: '18A Oba Elegushi Road, Ikoyi...',
            landmark: 'Landmark Towers Cntr., Victor...'
        }
    ];

    const getStatusStyle = (status: any) => {
        return status === 'New' ? styles.statusNew : styles.statusPickedUp;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Active orders</Text>

            <View style={styles.ordersList}>
                {orders.map((order) => (
                    <TouchableOpacity key={order.id} style={styles.orderCard} onPress={onPress}>
                        <View style={styles.orderHeader}>
                            <View>
                                <Text style={{ color: '#718096', fontSize: 12, marginBottom: 4 }}>Order ID</Text>
                                <Text style={styles.orderId}>{order.id}</Text>
                            </View>
                            <View style={[styles.statusBadge, getStatusStyle(order.status)]}>
                                <Text style={styles.statusText}>{order.status}</Text>
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
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4A5568',
        paddingHorizontal: 16,
        paddingTop: 20,
        borderRadius: 10,
    },
    header: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    ordersList: {
        flex: 1,
    },
    orderCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        borderBottomWidth:0.75,
        borderBottomColor:'#E2E8F0',
        paddingBottom:8
    },
    orderId: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A202C',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 3,
    },
    statusNew: {
        backgroundColor: '#FBD38D',
    },
    statusPickedUp: {
        backgroundColor: '#9AE6B4',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1A202C',
    },
    locationInfo: {
        gap: 8,
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
});

export default ActiveOrders;