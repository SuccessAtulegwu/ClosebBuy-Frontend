import { FlatList, Pressable, ScrollView, StyleSheet, Switch, Text, Image, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useMemo, useState } from 'react'
import { ThemeContext } from '@/context/ThemeContext';
import { ThemedView } from '@/components/ThemedView';
import { Stack } from 'expo-router';
import { HomeHeader } from '@/components/HomeHeader';
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { fontFamilies } from '@/constants/app.constants';
import { categoriesList, Category, sampleProducts } from '@/constants/app.data';
import { ProductCart } from '@/components/ProductCart';

type Product = {
    id: number;
    name: string;
    vendorId: number;
    shopId: number;
    inStock: boolean;
    price: number; // NGN
};

type Vendor = { id: number; name: string };
type Shop = { id: number; name: string };

const VENDORS = [
    { id: 1, name: "Shoprite" },
    { id: 2, name: "Spar" },
    { id: 3, name: "Justrite" },
];

const CATEGORIES = [
    { id: 1, name: "Groceries" },
    { id: 2, name: "Appliances" },
    { id: 3, name: "Fashion" },
    { id: 4, name: "Furniture" },
];

const PRODUCTS: Product[] = [
    { id: 101, name: 'Golden Morn', vendorId: 1, shopId: 10, inStock: true, price: 1800 },
    { id: 102, name: 'Peak Milk 1L', vendorId: 1, shopId: 11, inStock: true, price: 3200 },
    { id: 103, name: 'Indomie 40pcs', vendorId: 2, shopId: 12, inStock: false, price: 9500 },
    { id: 104, name: 'Milo Refill 500g', vendorId: 3, shopId: 10, inStock: true, price: 4300 },
    { id: 105, name: 'Yam Tubers (2)', vendorId: 2, shopId: 11, inStock: true, price: 5200 },
    { id: 106, name: 'Rice 10kg', vendorId: 3, shopId: 12, inStock: true, price: 13800 },
];

const formatNaira = (value: number) =>
    `₦${(value || 0).toLocaleString('en-NG')}`;

export function HomeScreen() {
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const [search, setSearch] = useState('');
    const [selectedVendorId, setSelectedVendorId] = useState<number | null>(null);
    const [selectedShopId, setSelectedShopId] = useState<number | null>(null);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [minPrice, setMinPrice] = useState<string>(''); // keep as string for input
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [selectedVendor, setSelectedVendor] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const inset = useSafeAreaInsets();
    const minPriceNum = Number(minPrice) || 0;
    const maxPriceNum = Number(maxPrice) || Number.MAX_SAFE_INTEGER;
    const [unreadCount, setUnreadCount] = useState(90);

    const filtered = useMemo(() => {
        return PRODUCTS.filter((p) => {
            const matchesSearch =
                !search ||
                p.name.toLowerCase().includes(search.trim().toLowerCase());
            const matchesVendor =
                selectedVendorId === null || p.vendorId === selectedVendorId;
            const matchesShop =
                selectedShopId === null || p.shopId === selectedShopId;
            const matchesStock = !inStockOnly || p.inStock;
            const matchesPrice = p.price >= minPriceNum && p.price <= maxPriceNum;
            return (
                matchesSearch && matchesVendor && matchesShop && matchesStock && matchesPrice
            );
        });
    }, [search, selectedVendorId, selectedShopId, inStockOnly, minPriceNum, maxPriceNum]);

    const clearFilters = () => {
        setSearch('');
        setSelectedVendorId(null);
        setSelectedShopId(null);
        setInStockOnly(false);
        setMinPrice('');
        setMaxPrice('');
    };

    const handleCategoryPress =(category:any)=>{
       // console.log('cat',category)
    }

    const renderCategory = (category: Category) => (
        <TouchableOpacity
            key={category.id}
            style={[styles.categoryItem, { backgroundColor: category.color }]}
        onPress={() => handleCategoryPress(category)}
        >
            <Ionicons name={category.icon as any} size={24} color="white" />
            <Text style={styles.categoryText}>{category.name}</Text>
        </TouchableOpacity>
    );

    return (
        <>
            <Stack.Screen options={{
                headerShown: true, header: () => <ThemedView style={[styles.header, { paddingTop: inset.top + 10 }]}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.logoText}>
                            <Text style={styles.logoHyper}>Close</Text>
                            <Text style={styles.logoMart}>Buy</Text>
                        </Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity>
                            <View style={styles.iconWrapper}>
                                <MaterialCommunityIcons name="cart-outline" size={24} color={theme.text} />
                                {unreadCount > 0 && (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={styles.iconWrapper}>
                                <Feather name="bell" size={20} color={theme.text} />
                                {unreadCount > 0 && (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                </ThemedView>
            }} />
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Header */}
                {/* Location */}
                {/*  <View style={styles.locationContainer}>
                    <View style={styles.locationIcon}>
                        <Ionicons name="location" size={20} color="white" />
                    </View>
                    <View style={styles.locationText}>
                        <Text style={styles.cityText}>Bengaluru</Text>
                        <Text style={styles.areaText}>BTM Layout, 560628</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                </View> */}

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Feather name="search" size={20} color="#999" />
                        <TextInput
                            placeholder="Search Anything..."
                            style={styles.searchInput}
                            placeholderTextColor="#999"
                        />
                    </View>
                    <View style={styles.micButton}>
                        <Ionicons name="filter-circle-outline" size={28} color="#5cb85c" />
                    </View>
                </View>

                {/* Weekend Offer Banner */}
                <View style={styles.bannerContainer}>
                    <View style={styles.bannerContent}>
                        <View style={styles.bannerLeft}>
                            <View style={styles.bannerIcon}>
                                <MaterialIcons name="grid-view" size={16} color="#666" />
                            </View>
                            <Text style={styles.bannerTitle}>Happy Weekend</Text>
                            <Text style={styles.bannerDiscount}>25% OFF</Text>
                            <Text style={styles.bannerSubtitle}>*for All Menus</Text>
                        </View>
                        <View style={styles.bannerRight}>
                            <Image
                                source={{
                                    uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=150&fit=crop'
                                }}
                                style={styles.bannerImage}
                                resizeMode="cover"
                            />
                        </View>
                    </View>
                </View>

                {/* Categories */}
                <View style={styles.categoriesContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Categories</Text>
                        <Ionicons name="chevron-forward" size={20} color="#666" />
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
                        {categoriesList.map(renderCategory)}
                    </ScrollView>
                </View>

                <ProductCart
                    products={sampleProducts}
                    title="Fresh Fruits"
                />
            </ScrollView>
        </>

    )
}


function getStyles(theme: any) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#f8f9fa',
        },
        scrollContainer: {
            flex: 1,
            paddingHorizontal: 20,
            backgroundColor: theme.background,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 20,
            paddingHorizontal: 20,
        },
        headerLeft: {},
        logoText: {
            fontSize: 22,
            fontWeight: 'bold',
        },
        logoHyper: {
            color: theme.accent,
        },
        logoMart: {
            color: theme.secondary,
        },
        headerRight: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        langText: {
            fontSize: 14,
            color: '#333',
            marginRight: 5,
        },
        notificationBadge: {
            marginLeft: 15,
        },
        locationContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            padding: 15,
            borderRadius: 12,
            marginBottom: 20,
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
            backgroundColor: '#5cb85c',
            borderRadius: 25,
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 15,
        },
        locationText: {
            flex: 1,
        },
        cityText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#333',
        },
        areaText: {
            fontSize: 14,
            color: '#666',
            marginTop: 2,
        },
        searchContainer: {
            flexDirection: 'row',
            marginBottom: 20,
        },
        searchBar: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.cardcolor,
            borderRadius: 25,
            paddingHorizontal: 15,
            paddingVertical: 12,
            marginRight: 10,
        },
        searchInput: {
            flex: 1,
            marginLeft: 10,
            fontSize: 16,
            color: theme.tabIconDefault,
        },
        micButton: {
            backgroundColor: '#f0f0f0',
            borderRadius: 25,
            width: 45,
            height: 45,
            justifyContent: 'center',
            alignItems: 'center',
        },
        bannerContainer: {
            backgroundColor: '#e8f5e8',
            borderRadius: 16,
            padding: 20,
            marginBottom: 25,
        },
        bannerContent: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        bannerLeft: {
            flex: 1,
        },
        bannerIcon: {
            marginBottom: 8,
        },
        bannerTitle: {
            fontSize: 16,
            color: '#666',
            marginBottom: 5,
        },
        bannerDiscount: {
            fontSize: 28,
            fontWeight: 'bold',
            color: '#333',
            marginBottom: 2,
        },
        bannerSubtitle: {
            fontSize: 12,
            color: '#666',
        },
        bannerRight: {
            width: 120,
            height: 80,
        },
        bannerImage: {
            width: '100%',
            height: '100%',
            borderRadius: 12,
        },
        categoriesContainer: {
            marginBottom: 25,
        },
        sectionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 15,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.text,
        },
        categoriesScroll: {
            flexDirection: 'row',
        },
        categoryItem: {
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: 16,
            marginRight: 15,
        },
        categoryText: {
            color: 'white',
            fontSize: 12,
            fontWeight: '500',
            textAlign: 'center',
            marginTop: 5,
        },

        iconContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 15,
            gap: 35,
        },
        iconWrapper: {
            position: 'relative',
        },
        badge: {
            position: 'absolute',
            top: -10,
            right: -10,
            backgroundColor: theme.accent,
            borderRadius: 12,
            minWidth: 20,
            height: 20,
            paddingHorizontal: 1,
            paddingVertical: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        badgeText: {
            color: '#fff',
            fontSize: 10,
            fontFamily: fontFamilies.NunitoSemiBold,
            textAlign: 'center',
        },

    })
}