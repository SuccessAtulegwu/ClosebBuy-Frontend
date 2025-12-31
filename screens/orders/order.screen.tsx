import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Animated, Alert } from 'react-native'
import React, { useContext, useState, useEffect, useRef } from 'react'
import { ThemeContext } from '@/context/ThemeContext';
import { Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { HomeHeader } from '@/components/HomeHeader';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Order as OrderType, OrderItem } from '@/types/publicTypes';
import { OrderStatus } from '@/types/publicenums';

const { width } = Dimensions.get('window');

// Enhanced Types for Professional Order Tracking
interface OrderProduct {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

interface TimelineStep {
    title: string;
    date: string;
    time?: string;
    completed: boolean;
    description?: string;
}

interface Order {
    id: string;
    date: string;
    itemsCount: number;
    price: string;
    status: 'placed' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
    statusIndex: number;
    timeline: TimelineStep[];
    products?: OrderProduct[];
    estimatedDelivery?: string;
    trackingNumber?: string;
}

export function OrderScreen() {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    const [expandedId, setExpandedId] = useState<string | null>('90897');

    // Status Badge Component
    const StatusBadge = ({ status }: { status: Order['status'] }) => {
        const statusConfig = {
            placed: { label: 'Order Placed', color: '#3B82F6', bg: '#DBEAFE', icon: 'receipt' as any },
            confirmed: { label: 'Confirmed', color: '#8B5CF6', bg: '#EDE9FE', icon: 'checkmark-circle' as any },
            shipped: { label: 'Shipped', color: '#F59E0B', bg: '#FEF3C7', icon: 'rocket' as any },
            out_for_delivery: { label: 'Out for Delivery', color: '#10B981', bg: '#D1FAE5', icon: 'bicycle' as any },
            delivered: { label: 'Delivered', color: '#65A30D', bg: '#ECFCCB', icon: 'checkmark-done-circle' as any },
            cancelled: { label: 'Cancelled', color: '#EF4444', bg: '#FEE2E2', icon: 'close-circle' as any },
        };

        const config = statusConfig[status];

        return (
            <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
                <Ionicons name={config.icon} size={14} color={config.color} />
                <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
            </View>
        );
    };

    // Progress Bar Component - memoized to prevent re-animation
    const ProgressBar = React.memo(({ progress }: { progress: number }) => {
        const animatedWidth = useRef(new Animated.Value(progress)).current;

        useEffect(() => {
            Animated.timing(animatedWidth, {
                toValue: progress,
                duration: 800,
                useNativeDriver: false,
            }).start();
        }, [progress]);

        const width = animatedWidth.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
        });

        return (
            <View style={styles.progressBarContainer}>
                <Animated.View style={[styles.progressBarFill, { width }]} />
            </View>
        );
    });


    const orders: Order[] = [
        {
            id: '90897',
            date: 'October 19, 2024',
            itemsCount: 10,
            price: '16.90',
            status: 'shipped',
            statusIndex: 2,
            estimatedDelivery: 'Dec 30, 2024',
            trackingNumber: 'TRK90897XYZ',
            timeline: [
                { title: 'Order placed', date: 'Oct 19, 2024', time: '10:30 AM', completed: true, description: 'Your order has been received' },
                { title: 'Order confirmed', date: 'Oct 20, 2024', time: '09:15 AM', completed: true, description: 'Payment confirmed and processing started' },
                { title: 'Order shipped', date: 'Oct 20, 2024', time: '02:45 PM', completed: true, description: 'Package picked up by courier' },
                { title: 'Out for delivery', date: 'pending', completed: false, description: 'Package is on its way to you' },
                { title: 'Order delivered', date: 'pending', completed: false, description: 'Package will be delivered to your address' },
            ],
            products: [
                { id: '1', name: 'Fresh Tomatoes', quantity: 2, price: 4.50 },
                { id: '2', name: 'Organic Bread', quantity: 1, price: 3.20 },
                { id: '3', name: 'Milk (1L)', quantity: 1, price: 2.80 },
            ]
        },
        {
            id: '90898',
            date: 'October 19, 2024',
            itemsCount: 10,
            price: '16.90',
            status: 'placed',
            statusIndex: 0,
            estimatedDelivery: 'Dec 31, 2024',
            trackingNumber: 'TRK90898ABC',
            timeline: [
                { title: 'Order placed', date: 'Oct 19, 2024', time: '08:20 AM', completed: true, description: 'Your order has been received' },
                { title: 'Order confirmed', date: 'pending', completed: false, description: 'Waiting for payment confirmation' },
                { title: 'Order shipped', date: 'pending', completed: false, description: 'Package will be shipped soon' },
                { title: 'Out for delivery', date: 'pending', completed: false, description: 'Package is on its way to you' },
                { title: 'Order delivered', date: 'pending', completed: false, description: 'Package will be delivered to your address' },
            ],
            products: [
                { id: '1', name: 'Fresh Vegetables Pack', quantity: 1, price: 12.90 },
                { id: '2', name: 'Cooking Oil', quantity: 1, price: 4.00 },
            ]
        },
        {
            id: '90899',
            date: 'August 29, 2024',
            itemsCount: 10,
            price: '16.90',
            status: 'delivered',
            statusIndex: 5,
            trackingNumber: 'TRK90899DEF',
            timeline: [
                { title: 'Order placed', date: 'Aug 25, 2024', time: '11:00 AM', completed: true, description: 'Your order has been received' },
                { title: 'Order confirmed', date: 'Aug 25, 2024', time: '11:30 AM', completed: true, description: 'Payment confirmed and processing started' },
                { title: 'Order shipped', date: 'Aug 26, 2024', time: '09:00 AM', completed: true, description: 'Package picked up by courier' },
                { title: 'Out for delivery', date: 'Aug 29, 2024', time: '08:30 AM', completed: true, description: 'Package is on its way to you' },
                { title: 'Order delivered', date: 'Aug 29, 2024', time: '02:15 PM', completed: true, description: 'Package delivered successfully' },
            ],
            products: [
                { id: '1', name: 'Rice (5kg)', quantity: 1, price: 8.50 },
                { id: '2', name: 'Beans (2kg)', quantity: 1, price: 5.40 },
                { id: '3', name: 'Spices Mix', quantity: 1, price: 3.00 },
            ]
        }
    ];

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    // Calculate progress percentage
    const calculateProgress = (timeline: TimelineStep[]) => {
        const completedSteps = timeline.filter(step => step.completed).length;
        return (completedSteps / timeline.length) * 100;
    };

    // Handle order actions
    const handleTrackOrder = (orderId: string, trackingNumber: string | undefined) => {
        // This would typically open a tracking modal or navigate to a tracking screen
        // For now, show tracking information in an alert
        Alert.alert(
            'Track Your Order',
            trackingNumber 
                ? `Tracking Number: ${trackingNumber}\n\nThis feature will show real-time location tracking on a map in the full implementation.`
                : 'Tracking information will be available once your order is shipped.',
            [{ text: 'OK' }]
        );
    };

    const handleContactSupport = (orderId: string) => {
        // This would typically open a support chat, email, or call interface
        Alert.alert(
            'Contact Support',
            `Need help with Order #${orderId}?\n\nChoose an option:`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Call Support', onPress: () => Alert.alert('Calling', 'Opening phone dialer...') },
                { text: 'Chat with Us', onPress: () => Alert.alert('Chat', 'Opening support chat...') },
            ]
        );
    };

    // Timeline Item Component (to properly use hooks)
    const TimelineItem = ({ step, index, timeline }: { step: TimelineStep, index: number, timeline: TimelineStep[] }) => {
        const scaleAnim = useRef(new Animated.Value(step.completed ? 1 : 0.8)).current;
        
        useEffect(() => {
            if (step.completed) {
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 3,
                    useNativeDriver: true,
                }).start();
            }
        }, [step.completed]);

        return (
            <View style={styles.timelineItem}>
                {/* Line connector */}
                {index !== timeline.length - 1 && (
                    <View style={[
                        styles.timelineLine,
                        { backgroundColor: step.completed && timeline[index + 1]?.completed ? '#65A30D' : '#E5E7EB' }
                    ]} />
                )}

                <View style={styles.timelineContent}>
                    <Animated.View style={[
                        styles.timelineDot,
                        step.completed ? styles.dotCompleted : styles.dotPending,
                        { transform: [{ scale: scaleAnim }] }
                    ]}>
                        {step.completed && (
                            <Ionicons name="checkmark" size={8} color="#FFFFFF" />
                        )}
                    </Animated.View>

                    <View style={styles.timelineInfo}>
                        <Text style={[
                            styles.timelineTitle,
                            step.completed ? styles.textCompleted : styles.textPending
                        ]}>
                            {step.title}
                        </Text>
                        
                        {step.description && (
                            <Text style={styles.timelineDescription}>
                                {step.description}
                            </Text>
                        )}

                        <View style={styles.timelineDateTime}>
                            <Text style={styles.timelineDate}>
                                {step.date}
                            </Text>
                            {step.time && (
                                <Text style={styles.timelineTime}>
                                    {step.time}
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    // Enhanced Timeline with Animations
    const renderTimeline = (timeline: TimelineStep[]) => {
        return (
            <View style={styles.timelineContainer}>
                {timeline.map((step, index) => (
                    <TimelineItem 
                        key={index} 
                        step={step} 
                        index={index} 
                        timeline={timeline} 
                    />
                ))}
            </View>
        );
    };

    const renderOrderCard = (item: Order) => {
        const isExpanded = expandedId === item.id;
        const progress = calculateProgress(item.timeline);

        return (
            <View key={item.id} style={styles.cardContainer}>
                {/* Header */}
                <TouchableOpacity
                    style={[styles.cardHeader, isExpanded && styles.cardHeaderExpanded]}
                    onPress={() => toggleExpand(item.id)}
                    activeOpacity={0.8}
                >
                    <View style={styles.headerLeft}>
                        {/* Icon with status indicator */}
                        <View style={styles.iconCircle}>
                            <Feather name="package" size={24} color="#65A30D" />
                            {item.status === 'delivered' && (
                                <View style={styles.deliveredBadge}>
                                    <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                                </View>
                            )}
                        </View>

                        <View style={styles.headerInfo}>
                            <View style={styles.orderNumberRow}>
                                <Text style={styles.orderNumber}>Order #{item.id}</Text>
                                <StatusBadge status={item.status} />
                            </View>
                            <Text style={styles.orderDate}>Placed on {item.date}</Text>
                            
                            {/* Progress Bar */}
                            <View style={styles.progressSection}>
                                <ProgressBar progress={progress} />
                                <Text style={styles.progressText}>{Math.round(progress)}% Complete</Text>
                            </View>

                            <View style={styles.orderStats}>
                                <View style={styles.statItem}>
                                    <Ionicons name="cube-outline" size={14} color="#6B7280" />
                                    <Text style={styles.orderStatText}>{item.itemsCount} items</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Ionicons name="cash-outline" size={14} color="#6B7280" />
                                    <Text style={styles.orderStatText}>${item.price}</Text>
                                </View>
                                {item.estimatedDelivery && item.status !== 'delivered' && (
                                    <View style={styles.statItem}>
                                        <Ionicons name="time-outline" size={14} color="#6B7280" />
                                        <Text style={styles.orderStatText}>ETA: {item.estimatedDelivery}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>

                    <View style={styles.chevronContainer}>
                        <Ionicons
                            name={isExpanded ? "chevron-up-circle" : "chevron-down-circle"}
                            size={28}
                            color="#10B981"
                        />
                    </View>
                </TouchableOpacity>

                {/* Expanded Body */}
                {isExpanded && (
                    <View style={styles.bodyContainer}>
                        {/* Order Details Section */}
                        {item.products && item.products.length > 0 && (
                            <View style={styles.orderDetailsSection}>
                                <Text style={styles.sectionTitle}>Order Items</Text>
                                {item.products.map((product) => (
                                    <View key={product.id} style={styles.productRow}>
                                        <View style={styles.productInfo}>
                                            <Text style={styles.productName}>{product.name}</Text>
                                            <Text style={styles.productQuantity}>Qty: {product.quantity}</Text>
                                        </View>
                                        <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
                                    </View>
                                ))}
                                <View style={styles.divider} />
                            </View>
                        )}

                        {/* Tracking Information */}
                        {item.trackingNumber && item.status !== 'placed' && (
                            <View style={styles.trackingSection}>
                                <View style={styles.trackingRow}>
                                    <MaterialCommunityIcons name="truck-delivery" size={20} color="#6B7280" />
                                    <View style={styles.trackingInfo}>
                                        <Text style={styles.trackingLabel}>Tracking Number</Text>
                                        <Text style={styles.trackingNumber}>{item.trackingNumber}</Text>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Timeline Section */}
                        <View style={styles.timelineSection}>
                            <Text style={styles.sectionTitle}>Order Timeline</Text>
                            {renderTimeline(item.timeline)}
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.actionButtonsContainer}>
                            {/* Track Order Button - Shows for active orders */}
                            {item.status !== 'delivered' && item.status !== 'cancelled' && (
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.trackButton]}
                                    onPress={() => handleTrackOrder(item.id, item.trackingNumber)}
                                >
                                    <MaterialCommunityIcons name="map-marker-path" size={18} color="#FFFFFF" />
                                    <Text style={styles.actionButtonText}>Track Order</Text>
                                </TouchableOpacity>
                            )}

                            {/* Contact Support Button - Always available */}
                            <TouchableOpacity
                                style={[styles.actionButton, styles.supportButton]}
                                onPress={() => handleContactSupport(item.id)}
                            >
                                <Ionicons name="headset-outline" size={18} color="#FFFFFF" />
                                <Text style={styles.actionButtonText}>Contact Support</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        );
    };

    return (
        <>
            <Stack.Screen options={{
                headerShown: true, header: () => <HomeHeader title='Orders' showCartIcon={true} showNotificationIcon={true}/>
            }} />
            <ThemedView style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {orders.map(renderOrderCard)}
                </ScrollView>
            </ThemedView>
        </>
    )
}


function getStyles(theme: any) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#F9FAFB',
        },
        scrollContent: {
            padding: 16,
            paddingBottom: 100,
        },
        cardContainer: {
            marginBottom: 16,
            borderRadius: 16,
            overflow: 'hidden',
        },
        cardHeader: {
            backgroundColor: '#FFFFFF',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: 16,
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
        },
        cardHeaderExpanded: {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#F3F4F6',
        },
        headerLeft: {
            flexDirection: 'row',
            flex: 1,
        },
        iconCircle: {
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: '#ECFCCB',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
            borderWidth: 2,
            borderColor: '#D9F99D',
            position: 'relative',
        },
        deliveredBadge: {
            position: 'absolute',
            top: 2,
            right: 2,
            width: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: '#65A30D',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: '#FFFFFF',
        },
        headerInfo: {
            flex: 1,
        },
        orderNumberRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 4,
        },
        orderNumber: {
            fontSize: 17,
            fontWeight: 'bold',
            color: '#1F2937',
        },
        orderDate: {
            fontSize: 12,
            color: '#9CA3AF',
            marginBottom: 10,
        },
        progressSection: {
            marginBottom: 10,
        },
        progressText: {
            fontSize: 11,
            color: '#6B7280',
            marginTop: 4,
            fontWeight: '500',
        },
        orderStats: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
        },
        statItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        orderStatText: {
            fontSize: 12,
            color: '#6B7280',
            fontWeight: '500',
        },
        statBold: {
            fontWeight: 'bold',
            color: '#1F2937',
        },
        chevronContainer: {
            paddingTop: 4,
            paddingLeft: 8,
        },
        bodyContainer: {
            backgroundColor: '#FFFFFF',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            padding: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
        },

        // Status Badge Styles
        statusBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
        },
        statusText: {
            fontSize: 10,
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },

        // Progress Bar Styles
        progressBarContainer: {
            height: 6,
            backgroundColor: '#E5E7EB',
            borderRadius: 3,
            overflow: 'hidden',
        },
        progressBarFill: {
            height: '100%',
            backgroundColor: '#65A30D',
            borderRadius: 3,
        },

        // Order Details Styles
        orderDetailsSection: {
            marginBottom: 20,
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#1F2937',
            marginBottom: 12,
        },
        productRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 8,
        },
        productInfo: {
            flex: 1,
        },
        productName: {
            fontSize: 14,
            color: '#374151',
            marginBottom: 2,
        },
        productQuantity: {
            fontSize: 12,
            color: '#9CA3AF',
        },
        productPrice: {
            fontSize: 14,
            fontWeight: 'bold',
            color: '#1F2937',
        },
        divider: {
            height: 1,
            backgroundColor: '#F3F4F6',
            marginVertical: 12,
        },

        // Tracking Styles
        trackingSection: {
            backgroundColor: '#F9FAFB',
            padding: 12,
            borderRadius: 12,
            marginBottom: 20,
        },
        trackingRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        trackingInfo: {
            flex: 1,
        },
        trackingLabel: {
            fontSize: 11,
            color: '#9CA3AF',
            marginBottom: 2,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        trackingNumber: {
            fontSize: 14,
            fontWeight: 'bold',
            color: '#1F2937',
        },

        // Timeline Styles
        timelineSection: {
            marginBottom: 20,
        },
        timelineContainer: {
            paddingLeft: 8,
        },
        timelineItem: {
            marginBottom: 20,
            position: 'relative',
        },
        timelineLine: {
            position: 'absolute',
            left: 7,
            top: 20,
            width: 2,
            height: 50,
            zIndex: 1,
        },
        timelineContent: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            zIndex: 2,
        },
        timelineDot: {
            width: 16,
            height: 16,
            borderRadius: 8,
            marginRight: 12,
            marginTop: 2,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: '#FFFFFF',
        },
        dotCompleted: {
            backgroundColor: '#65A30D',
        },
        dotPending: {
            backgroundColor: '#E5E7EB',
        },
        timelineInfo: {
            flex: 1,
        },
        timelineTitle: {
            fontSize: 15,
            fontWeight: '600',
            marginBottom: 4,
        },
        textCompleted: {
            color: '#1F2937',
        },
        textPending: {
            color: '#9CA3AF',
        },
        timelineDescription: {
            fontSize: 12,
            color: '#6B7280',
            marginBottom: 6,
            lineHeight: 16,
        },
        timelineDateTime: {
            flexDirection: 'row',
            gap: 8,
            marginTop: 2,
        },
        timelineDate: {
            fontSize: 12,
            color: '#9CA3AF',
            fontWeight: '500',
        },
        timelineTime: {
            fontSize: 12,
            color: '#9CA3AF',
        },

        // Action Buttons Styles
        actionButtonsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
            marginTop: 8,
        },
        actionButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            flex: 1,
            minWidth: 100,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
        },
        trackButton: {
            backgroundColor: '#10B981',
        },
        supportButton: {
            backgroundColor: '#3B82F6',
        },
        actionButtonText: {
            fontSize: 13,
            fontWeight: '600',
            color: '#FFFFFF',
        },
    })
}