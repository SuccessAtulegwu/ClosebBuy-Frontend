import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Switch } from 'react-native'
import React, { useContext, useState } from 'react'
import { ThemeContext } from '@/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';

export function AddressScreen() {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const inset = useSafeAreaInsets();
    const router = useRouter();

    const [expandedId, setExpandedId] = useState<string | null>('1'); // Default first expanded

    const [addresses, setAddresses] = useState([
        {
            id: '1',
            name: 'Russell Austin',
            address: '2811 Crescent Day, LA Port',
            city: 'California',
            country: 'United States 77571',
            fullAddressDisplay: '2811 Crescent Day, LA Port\nCalifornia, United States 77571',
            phone: '+1 202  555  0142',
            isDefault: true,
            zipCode: '77571'
        },
        {
            id: '2',
            name: 'Jissca Simpson',
            address: '2811 Crescent Day, LA Port',
            city: 'California',
            country: 'United States 77571',
            fullAddressDisplay: '2811 Crescent Day, LA Port\nCalifornia, United States 77571',
            phone: '+1 202  555  0142',
            isDefault: false,
            zipCode: '77571'
        }
    ]);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const toggleDefault = (id: string) => {
        setAddresses(addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === id
        })));
    };

    const renderAddressCard = (item: any) => {
        const isExpanded = expandedId === item.id;

        return (
            <View key={item.id} style={styles.cardContainer}>
                {item.isDefault && (
                    <View style={styles.defaultBadge}>
                        <Text style={styles.defaultText}>DEFAULT</Text>
                    </View>
                )}

                {/* Header / Summary */}
                <TouchableOpacity
                    style={[styles.cardHeader, isExpanded && styles.cardHeaderExpanded]}
                    onPress={() => toggleExpand(item.id)}
                    activeOpacity={0.8}
                >
                    <View style={styles.headerLeft}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="home-outline" size={20} color="#84CC16" />
                        </View>
                        <View style={styles.headerInfo}>
                            <Text style={styles.nameText}>{item.name}</Text>
                            <Text style={styles.addressText}>{item.fullAddressDisplay}</Text>
                            <Text style={styles.phoneText}>{item.phone}</Text>
                        </View>
                    </View>
                    <Ionicons
                        name={isExpanded ? "chevron-up-circle-outline" : "chevron-down-circle-outline"}
                        size={24}
                        color="#84CC16"
                    />
                </TouchableOpacity>

                {/* Expanded Form */}
                {isExpanded && (
                    <View style={styles.formContainer}>
                        {/* Name Input */}
                        <View style={styles.inputWrapper}>
                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={item.name}
                                    placeholder="Name"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                        </View>

                        {/* Address Input */}
                        <View style={styles.inputWrapper}>
                            <View style={styles.inputContainer}>
                                <Ionicons name="location-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={item.address}
                                    placeholder="Address"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                        </View>

                        {/* City & Zip Row */}
                        <View style={styles.row}>
                            <View style={[styles.inputWrapper, { flex: 1, marginRight: 8 }]}>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="map-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        value={item.city}
                                        placeholder="City"
                                        placeholderTextColor="#9CA3AF"
                                    />
                                </View>
                            </View>
                            <View style={[styles.inputWrapper, { flex: 1, marginLeft: 8 }]}>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="card-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        value={item.zipCode}
                                        placeholder="Zip code"
                                        placeholderTextColor="#9CA3AF"
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Country Input */}
                        <View style={styles.inputWrapper}>
                            <View style={styles.inputContainer}>
                                <Ionicons name="globe-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Text style={[styles.input, { paddingTop: 12 }]}>United States</Text>
                                </View>
                                <Ionicons name="caret-down-outline" size={16} color="#D1D5DB" />
                            </View>
                        </View>

                        {/* Phone Input */}
                        <View style={styles.inputWrapper}>
                            <View style={styles.inputContainer}>
                                <Ionicons name="call-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={item.phone}
                                    placeholder="Phone number"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                        </View>

                        {/* Make Default Toggle */}
                        <View style={styles.toggleRow}>
                            <Switch
                                trackColor={{ false: '#D1D5DB', true: '#84CC16' }}
                                thumbColor={'#FFFFFF'}
                                ios_backgroundColor="#D1D5DB"
                                onValueChange={() => toggleDefault(item.id)}
                                value={item.isDefault}
                            />
                            <Text style={styles.toggleLabel}>Make default</Text>
                        </View>

                    </View>
                )}
            </View>
        );
    };

    return (
        <>
            <Stack.Screen options={{
                headerBackTitle:'Back',
                headerTitle: 'My Address',
                headerTitleStyle: {
                    fontSize: 18,
                    fontWeight: '600',
                    color: theme.text,
                },
                headerStyle: {
                    backgroundColor: theme.background,
                },
                headerShadowVisible: false,
            }} />

            <ThemedView style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {addresses.map(renderAddressCard)}
                </ScrollView>

                <View style={[styles.footer, { paddingBottom: inset.bottom + 20 }]}>
                    <TouchableOpacity style={styles.saveButton} onPress={() => router.back()}>
                        <Text style={styles.saveButtonText}>Save settings</Text>
                    </TouchableOpacity>
                </View>
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
            padding: 20,
            gap: 20,
            paddingBottom: 100,
        },
        cardContainer: {
            backgroundColor: '#FFFFFF', 
            borderRadius: 0, 
            marginBottom: 10,
        },

        defaultBadge: {
            position: 'absolute',
            top: -10,
            left: 0,
            backgroundColor: '#ECFCCB', // Light lime
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
            zIndex: 10,
        },
        defaultText: {
            fontSize: 10,
            color: '#65A30D',
            fontWeight: 'bold',
        },
        cardHeader: {
            backgroundColor: '#FFFFFF', // White header
            flexDirection: 'row',
            alignItems: 'flex-start', // Top align for icon and text
            justifyContent: 'space-between',
            padding: 16,
            borderRadius: 12, // If collapsed
            // Shadow
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
        },
        cardHeaderExpanded: {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#F3F4F6',
            shadowOpacity: 0, // Remove shadow when expanded if we want a seamless look, or keep it.
            elevation: 0,
        },
        headerLeft: {
            flexDirection: 'row',
            flex: 1,
        },
        iconCircle: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: '#ECFCCB', // Very light lime
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
        },
        headerInfo: {
            flex: 1,
            paddingTop: 2,
        },
        nameText: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#1F2937',
            marginBottom: 4,
        },
        addressText: {
            fontSize: 13,
            color: '#6B7280',
            lineHeight: 18,
            marginBottom: 4,
        },
        phoneText: {
            fontSize: 13,
            color: '#1F2937', // Darker for phone
            fontWeight: '600',
        },
        formContainer: {
            backgroundColor: '#FFFFFF',
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            padding: 20,
            paddingTop: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
            marginBottom: 10, // Margin only when expanded/form is visible
        },
        inputWrapper: {
            marginBottom: 12,
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F3F4F6', // Grey input background
            borderRadius: 8,
            paddingHorizontal: 12,
            height: 48,
        },
        inputIcon: {
            marginRight: 10,
        },
        input: {
            flex: 1,
            fontSize: 14,
            color: '#1F2937',
        },
        row: {
            flexDirection: 'row',
        },
        toggleRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 8,
        },
        toggleLabel: {
            fontSize: 14,
            color: '#1F2937',
            marginLeft: 12,
            fontWeight: '500',
        },
        footer: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#F9FAFB',
            paddingHorizontal: 20,
            paddingTop: 10,
        },
        saveButton: {
            backgroundColor: '#84CC16', // Lime green
            height: 54,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#84CC16',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4,
        },
        saveButtonText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '600',
        }
    })
}