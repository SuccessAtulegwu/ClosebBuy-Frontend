import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList, Animated, Alert } from 'react-native'
import React, { useContext, useState, useRef } from 'react'
import { ThemeContext } from '@/context/ThemeContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Notification as NotificationBase } from '@/types/publicTypes';
import { NotificationType } from '@/types/publicenums';

// Extend the base Notification type with UI-specific fields
interface UINotification extends Omit<NotificationBase, 'user' | 'userId' | 'createdAt'> {
    timestamp: Date;
    actionData?: any;
}

// Filter tabs
const FILTER_TABS = [
    { key: 'ALL', label: 'All' },
    { key: NotificationType.ORDER, label: 'Orders' },
    { key: NotificationType.PAYMENT, label: 'Payments' },
    { key: NotificationType.DELIVERY, label: 'Delivery' },
    { key: NotificationType.WITHDRAWAL, label: 'Withdrawals' },
    { key: NotificationType.SYSTEM, label: 'System' },
];

export function NotificationScreen() {
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const inset = useSafeAreaInsets();
    const router = useRouter();
    
    const [selectedFilter, setSelectedFilter] = useState('ALL');
    const [notifications, setNotifications] = useState<UINotification[]>(generateMockNotifications());

    // Calculate unread count
    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Filter notifications
    const filteredNotifications = selectedFilter === 'ALL' 
        ? notifications 
        : notifications.filter(n => n.type === selectedFilter);

    // Group notifications by date
    const groupedNotifications = groupNotificationsByDate(filteredNotifications);

    // Mark notification as read
    const markAsRead = (id: number) => {
        setNotifications(prev => prev.map(n => 
            n.id === id ? { ...n, isRead: true } : n
        ));
    };

    // Mark all as read
    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    // Delete notification
    const deleteNotification = (id: number) => {
        Alert.alert(
            'Delete Notification',
            'Are you sure you want to delete this notification?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setNotifications(prev => prev.filter(n => n.id !== id));
                    }
                }
            ]
        );
    };

    // Clear all notifications
    const clearAllNotifications = () => {
        Alert.alert(
            'Clear All Notifications',
            'Are you sure you want to clear all notifications?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: () => {
                        setNotifications([]);
                    }
                }
            ]
        );
    };

    // Handle notification press
    const handleNotificationPress = (notification: UINotification) => {
        markAsRead(notification.id);
        
        // Navigate based on notification type
        switch (notification.type) {
            case NotificationType.ORDER:
            case NotificationType.ORDER_UPDATE:
                // router.push(`/(routes)/orders/${notification.actionData?.orderId}`);
                break;
            case NotificationType.PAYMENT:
                // router.push('/(routes)/payments');
                break;
            case NotificationType.DELIVERY:
                // router.push('/(routes)/deliveries');
                break;
            case NotificationType.WITHDRAWAL:
                // router.push('/(routes)/withdrawals');
                break;
            default:
                break;
        }
    };

    // Render notification icon
    const getNotificationIcon = (type: NotificationType) => {
        switch (type) {
            case NotificationType.ORDER:
            case NotificationType.ORDER_UPDATE:
            case NotificationType.ORDER_PLACED:
                return { name: 'cart-outline' as const, color: '#3B82F6' };
            case NotificationType.PAYMENT:
                return { name: 'card-outline' as const, color: '#10B981' };
            case NotificationType.DELIVERY:
                return { name: 'bicycle-outline' as const, color: '#F59E0B' };
            case NotificationType.WITHDRAWAL:
                return { name: 'cash-outline' as const, color: '#8B5CF6' };
            case NotificationType.MESSAGE:
                return { name: 'chatbubble-outline' as const, color: '#06B6D4' };
            case NotificationType.SYSTEM:
            default:
                return { name: 'information-circle-outline' as const, color: '#6B7280' };
        }
    };

    // Render single notification
    const renderNotification = (notification: UINotification) => {
        const iconData = getNotificationIcon(notification.type);
        
        return (
            <TouchableOpacity
                key={notification.id}
                style={[
                    styles.notificationCard,
                    !notification.isRead && styles.unreadNotification
                ]}
                onPress={() => handleNotificationPress(notification)}
                activeOpacity={0.7}
            >
                <View style={styles.notificationContent}>
                    <View style={[styles.iconContainer, { backgroundColor: iconData.color + '15' }]}>
                        <Ionicons name={iconData.name} size={24} color={iconData.color} />
                    </View>
                    
                    <View style={styles.textContainer}>
                        <View style={styles.titleRow}>
                            <Text style={[styles.notificationTitle, { color: theme.text }]}>
                                {notification.title}
                            </Text>
                            {!notification.isRead && (
                                <View style={styles.unreadDot} />
                            )}
                        </View>
                        <Text style={[styles.notificationMessage, { color: theme.icon }]} numberOfLines={2}>
                            {notification.message}
                        </Text>
                        <Text style={styles.timestamp}>
                            {formatTimestamp(notification.timestamp)}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => deleteNotification(notification.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <>
            <Stack.Screen 
                options={{
                    headerShown: true,
                    header: () => (
                        <ThemedView style={[styles.header, { paddingTop: inset.top + 10 }]}>
                            <ThemedView style={styles.headerTopRow}>
                                <TouchableOpacity 
                                    onPress={() => router.back()} 
                                    style={styles.backButton}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                                </TouchableOpacity>
                                
                                <ThemedView style={styles.headerContent}>
                                    <ThemedText style={styles.headerTitle}>Notifications</ThemedText>
                                    {unreadCount > 0 && (
                                        <ThemedView style={styles.headerBadge}>
                                            <ThemedText style={styles.headerBadgeText}>
                                                {unreadCount > 99 ? '99+' : unreadCount}
                                            </ThemedText>
                                        </ThemedView>
                                    )}
                                </ThemedView>

                                <View style={styles.headerSpacer} />
                            </ThemedView>
                            
                            {notifications.length > 0 && (
                                <ThemedView style={styles.headerActions}>
                                    {unreadCount > 0 && (
                                        <TouchableOpacity onPress={markAllAsRead} style={styles.headerButton}>
                                            <Ionicons name="checkmark-done-outline" size={20} color={theme.secondary} />
                                            <ThemedText style={[styles.headerButtonText, { color: theme.secondary }]}>
                                                Mark all read
                                            </ThemedText>
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity onPress={clearAllNotifications} style={styles.headerButton}>
                                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                        <ThemedText style={[styles.headerButtonText, { color: '#EF4444' }]}>
                                            Clear all
                                        </ThemedText>
                                    </TouchableOpacity>
                                </ThemedView>
                            )}
                        </ThemedView>
                    )
                }} 
            />

            <ThemedView style={styles.container}>
                {/* Filter Tabs */}
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterContainer}
                    contentContainerStyle={styles.filterContent}
                >
                    {FILTER_TABS.map(tab => (
                        <TouchableOpacity
                            key={tab.key}
                            style={[
                                styles.filterTab,
                                selectedFilter === tab.key && [styles.filterTabActive, { backgroundColor: theme.secondary }]
                            ]}
                            onPress={() => setSelectedFilter(tab.key)}
                        >
                            <ThemedText style={[
                                styles.filterTabText,
                                { color: selectedFilter === tab.key ? '#FFFFFF' : theme.icon }
                            ]}>
                                {tab.label}
                            </ThemedText>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Notifications List */}
                <ScrollView 
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {filteredNotifications.length === 0 ? (
                        <ThemedView style={styles.emptyContainer}>
                            <Ionicons name="notifications-off-outline" size={80} color={theme.icon} />
                            <ThemedText style={[styles.emptyTitle, { color: theme.text }]}>
                                No Notifications
                            </ThemedText>
                            <ThemedText style={[styles.emptySubtitle, { color: theme.icon }]}>
                                {selectedFilter === 'ALL' 
                                    ? "You're all caught up! No new notifications."
                                    : `No ${selectedFilter.toLowerCase()} notifications at the moment.`
                                }
                            </ThemedText>
                        </ThemedView>
                    ) : (
                        Object.entries(groupedNotifications).map(([dateLabel, items]) => (
                            <ThemedView key={dateLabel} style={styles.dateGroup}>
                                <ThemedText style={[styles.dateLabel, { color: theme.icon }]}>
                                    {dateLabel}
                                </ThemedText>
                                {items.map(notification => renderNotification(notification))}
                            </ThemedView>
                        ))
                    )}
                </ScrollView>
            </ThemedView>
        </>
    )
}

// Helper function to format timestamp
function formatTimestamp(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Helper function to group notifications by date
function groupNotificationsByDate(notifications: UINotification[]): Record<string, UINotification[]> {
    const groups: Record<string, UINotification[]> = {
        'Today': [],
        'Yesterday': [],
        'Earlier': []
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    notifications.forEach(notification => {
        const notifDate = new Date(notification.timestamp);
        notifDate.setHours(0, 0, 0, 0);

        if (notifDate.getTime() === today.getTime()) {
            groups['Today'].push(notification);
        } else if (notifDate.getTime() === yesterday.getTime()) {
            groups['Yesterday'].push(notification);
        } else {
            groups['Earlier'].push(notification);
        }
    });

    // Remove empty groups
    Object.keys(groups).forEach(key => {
        if (groups[key].length === 0) {
            delete groups[key];
        }
    });

    return groups;
}

// Generate mock notifications (replace with real API data)
function generateMockNotifications(): UINotification[] {
    return [
        {
            id: 1,
            type: NotificationType.ORDER_PLACED,
            title: 'New Order Received',
            message: 'Order #12345 has been placed. Total amount: ₦15,500',
            timestamp: new Date(Date.now() - 1000 * 60 * 5),
            isRead: false,
            actionData: { orderId: '12345' }
        },
        {
            id: 2,
            type: NotificationType.PAYMENT,
            title: 'Payment Confirmed',
            message: 'Payment of ₦25,000 has been confirmed for Order #12344',
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            isRead: false,
            actionData: { orderId: '12344' }
        },
        {
            id: 3,
            type: NotificationType.DELIVERY,
            title: 'Order Out for Delivery',
            message: 'Order #12343 is now out for delivery',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
            isRead: true,
            actionData: { orderId: '12343' }
        },
        {
            id: 4,
            type: NotificationType.ORDER_UPDATE,
            title: 'Order Completed',
            message: 'Order #12342 has been successfully delivered',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
            isRead: true,
            actionData: { orderId: '12342' }
        },
        {
            id: 5,
            type: NotificationType.WITHDRAWAL,
            title: 'Withdrawal Request Approved',
            message: 'Your withdrawal request of ₦50,000 has been approved',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
            isRead: false,
            actionData: { withdrawalId: 'WD123' }
        },
        {
            id: 6,
            type: NotificationType.ORDER_PLACED,
            title: 'New Order Received',
            message: 'Order #12341 has been placed. Total amount: ₦8,200',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
            isRead: true,
            actionData: { orderId: '12341' }
        },
        {
            id: 7,
            type: NotificationType.SYSTEM,
            title: 'System Update',
            message: 'The app has been updated with new features and improvements',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
            isRead: true
        },
        {
            id: 8,
            type: NotificationType.PAYMENT,
            title: 'Payment Received',
            message: 'Payment of ₦12,500 received for Order #12340',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
            isRead: true,
            actionData: { orderId: '12340' }
        },
        {
            id: 9,
            type: NotificationType.ORDER_UPDATE,
            title: 'Order Cancelled',
            message: 'Order #12339 has been cancelled by customer',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
            isRead: true,
            actionData: { orderId: '12339' }
        },
        {
            id: 10,
            type: NotificationType.MESSAGE,
            title: 'New Message',
            message: 'You have a new message from customer support',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96),
            isRead: true
        }
    ];
}

function getStyles(theme: any) {
    return StyleSheet.create({
        container: {
            flex: 1,
        },
        header: {
            paddingHorizontal: 16,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: theme.cardcolor,
        },
        headerTopRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
        },
        backButton: {
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'flex-start',
        },
        headerContent: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
        },
        headerSpacer: {
            width: 40,
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: '600',
        },
        headerBadge: {
            backgroundColor: '#EF4444',
            borderRadius: 12,
            paddingHorizontal: 8,
            paddingVertical: 2,
            marginLeft: 8,
            minWidth: 24,
            alignItems: 'center',
        },
        headerBadgeText: {
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: '600',
        },
        headerActions: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 12,
        },
        headerButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 8,
            backgroundColor: theme.cardcolor,
        },
        headerButtonText: {
            fontSize: 12,
            fontWeight: '500',
        },
        filterContainer: {
            maxHeight: 50,
            borderBottomWidth: 1,
            borderBottomColor: theme.cardcolor,
        },
        filterContent: {
            paddingHorizontal: 16,
            paddingVertical: 8,
            gap: 8,
        },
        filterTab: {
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: theme.cardcolor,
            marginRight: 8,
        },
        filterTabActive: {
            backgroundColor: theme.secondary,
        },
        filterTabText: {
            fontSize: 14,
            fontWeight: '500',
        },
        scrollView: {
            flex: 1,
        },
        scrollContent: {
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 30,
        },
        dateGroup: {
            marginBottom: 24,
        },
        dateLabel: {
            fontSize: 14,
            fontWeight: '600',
            marginBottom: 12,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        notificationCard: {
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 2,
        },
        unreadNotification: {
            backgroundColor: '#F0FDF4',
            borderLeftWidth: 4,
            borderLeftColor: '#10B981',
        },
        notificationContent: {
            flexDirection: 'row',
            flex: 1,
            alignItems: 'flex-start',
        },
        iconContainer: {
            width: 48,
            height: 48,
            borderRadius: 24,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        textContainer: {
            flex: 1,
        },
        titleRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 4,
        },
        notificationTitle: {
            fontSize: 16,
            fontWeight: '600',
            flex: 1,
        },
        unreadDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#10B981',
            marginLeft: 8,
        },
        notificationMessage: {
            fontSize: 14,
            lineHeight: 20,
            marginBottom: 6,
        },
        timestamp: {
            fontSize: 12,
            color: '#9CA3AF',
        },
        deleteButton: {
            padding: 8,
            marginLeft: 8,
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 60,
            paddingHorizontal: 32,
        },
        emptyTitle: {
            fontSize: 20,
            fontWeight: '600',
            marginTop: 16,
            marginBottom: 8,
        },
        emptySubtitle: {
            fontSize: 14,
            textAlign: 'center',
            lineHeight: 20,
        },
    })
}