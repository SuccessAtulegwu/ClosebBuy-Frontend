import { ThemeContext } from '@/context/ThemeContext';
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, TextInput } from 'react-native';
import { ThemedView } from './ThemedView';

const shops = [
    { id: 'all', name: 'All Shops' },
    { id: 'shop1', name: 'TechWorld Electronics' },
    { id: 'shop2', name: 'Fashion Hub' },
    { id: 'shop3', name: 'Home & Garden Store' },
    { id: 'shop4', name: 'Sports Center' },
    { id: 'shop5', name: 'Book Paradise' },
    { id: 'shop6', name: 'Grocery Mart' },
    { id: 'shop7', name: 'Beauty & Wellness' },
    { id: 'shop8', name: 'Auto Parts Plus' }
];

const sortOptions = [
    { id: 'all', label: 'All Items' },
    { id: 'in_stock', label: 'In Stock' },
    { id: 'low_stock', label: 'Low Stock' },
    { id: 'out_of_stock', label: 'Out of Stock' }
];

const priceRanges = [
    { id: 'all', label: 'All Prices', range: 'All' },
    { id: 'under_10', label: 'Under ₦10', range: '₦0 - ₦10' },
    { id: '10_50', label: '₦10 - ₦50', range: '₦10 - ₦50' },
    { id: '50_100', label: '₦50 - ₦100', range: '₦50 - ₦100' },
    { id: '100_200', label: '₦100 - ₦200', range: '₦100 - ₦200' },
    { id: 'over_200', label: 'Over ₦200', range: '₦200+' }
];

const FilterSortComponent = ({ onFilterChange }: any) => {
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
    const [selectedSort, setSelectedSort] = useState('all');
    const [selectedShop, setSelectedShop] = useState('all');
    const [selectedPrice, setSelectedPrice] = useState('all');
    const [shopModalVisible, setShopModalVisible] = useState(false);
    const [priceModalVisible, setPriceModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [priceSearchQuery, setPriceSearchQuery] = useState('');
    const styles = getStyles(theme);

    const filteredShops = shops.filter(shop =>
        shop.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredPrices = priceRanges.filter(price =>
        price.label.toLowerCase().includes(priceSearchQuery.toLowerCase())
    );

    const getSelectedShopName = () => {
        const shop = shops.find(s => s.id === selectedShop);
        return shop ? shop.name : 'All Shops';
    };

    const getSelectedPriceName = () => {
        const price = priceRanges.find(p => p.id === selectedPrice);
        return price ? price.label : 'All Prices';
    };

    const getSortLabel = () => {
        const sort = sortOptions.find(s => s.id === selectedSort);
        return sort ? sort.label : 'All Items';
    };

    const handleShopSelect = (shopId: any) => {
        setSelectedShop(shopId);
        setShopModalVisible(false);
        setSearchQuery('');
    };

    const handlePriceSelect = (priceId: any) => {
        setSelectedPrice(priceId);
        setPriceModalVisible(false);
        setPriceSearchQuery('');
    };

    const handleSortSelect = (sortId: any) => {
        setSelectedSort(sortId);
    };

    const applyFilters = () => {
        // This is where you'd apply the filters to your data
        const filters = { sortBy: selectedSort, shopId: selectedShop, priceRange: selectedPrice };
        //console.log('Applying filters:', filters);

        // Call the parent's callback function if provided
        if (onFilterChange) {
            onFilterChange(filters);
        }
    };

    // Call applyFilters whenever filters change
    useEffect(() => {
        applyFilters();
    }, [selectedSort, selectedShop, selectedPrice]);

    return (
        <View style={styles.container}>
            {/* Filter Row */}
            <View style={styles.filterRow}>
                {/* Stock Sort Filter */}
                <View style={styles.filterItem}>
                    <Text style={styles.filterLabel}>Stock Status</Text>
                    <View style={styles.dropdownContainer}>
                        {sortOptions.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                style={[
                                    styles.sortOption,
                                    selectedSort === option.id && styles.activeSortOption
                                ]}
                                onPress={() => handleSortSelect(option.id)}
                            >
                                <Ionicons name="cube-outline" size={14} color={selectedSort === option.id ? '#007AFF' : '#666'} />
                                <Text style={[
                                    styles.sortOptionText,
                                    selectedSort === option.id && styles.activeSortOptionText
                                ]}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Shop Selection Filter */}
                <View style={styles.filterItem}>
                    <Text style={styles.filterLabel}>Shop</Text>
                    <TouchableOpacity
                        style={styles.shopSelector}
                        onPress={() => setShopModalVisible(true)}
                    >
                        <View style={styles.shopSelectorContent}>
                            <Ionicons name="storefront-outline" size={16} color="#666" />
                            <Text style={styles.shopSelectorText} numberOfLines={1}>
                                {getSelectedShopName()}
                            </Text>
                            <Ionicons name="chevron-down" size={16} color="#666" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Second Filter Row for Price */}
            <View style={styles.secondFilterRow}>
                <View style={styles.filterItem}>
                    <Text style={styles.filterLabel}>Price Range</Text>
                    <TouchableOpacity
                        style={styles.shopSelector}
                        onPress={() => setPriceModalVisible(true)}
                    >
                        <View style={styles.shopSelectorContent}>
                            <Ionicons name="pricetag-outline" size={16} color="#666" />
                            <Text style={styles.shopSelectorText} numberOfLines={1}>
                                {getSelectedPriceName()}
                            </Text>
                            <Ionicons name="chevron-down" size={16} color="#666" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Active Filters Display */}
            {(selectedSort !== 'all' || selectedShop !== 'all' || selectedPrice !== 'all') && (
                <View style={styles.activeFilters}>
                    <Text style={styles.activeFiltersLabel}>Active filters:</Text>
                    <View style={styles.activeFilterTags}>
                        {selectedSort !== 'all' && (
                            <TouchableOpacity
                                style={styles.filterTag}
                                onPress={() => setSelectedSort('all')}
                            >
                                <Text style={styles.filterTagText}>{getSortLabel()}</Text>
                                <Ionicons name="close" size={14} color="#007AFF" />
                            </TouchableOpacity>
                        )}
                        {selectedShop !== 'all' && (
                            <TouchableOpacity
                                style={styles.filterTag}
                                onPress={() => setSelectedShop('all')}
                            >
                                <Text style={styles.filterTagText}>{getSelectedShopName()}</Text>
                                <Ionicons name="close" size={14} color="#007AFF" />
                            </TouchableOpacity>
                        )}
                        {selectedPrice !== 'all' && (
                            <TouchableOpacity
                                style={styles.filterTag}
                                onPress={() => setSelectedPrice('all')}
                            >
                                <Text style={styles.filterTagText}>{getSelectedPriceName()}</Text>
                                <Ionicons name="close" size={14} color="#007AFF" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}

            {/* Shop Selection Modal */}
            <Modal
                visible={shopModalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select Shop</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => {
                                setShopModalVisible(false);
                                setSearchQuery('');
                            }}
                        >
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color="#666" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search shops..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor="#999"
                        />
                    </View>

                    <FlatList
                        data={filteredShops}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.shopOption,
                                    selectedShop === item.id && styles.activeShopOption
                                ]}
                                onPress={() => handleShopSelect(item.id)}
                            >
                                <Ionicons name="storefront-outline" size={20} color={selectedShop === item.id ? '#007AFF' : '#666'} />
                                <Text style={[
                                    styles.shopOptionText,
                                    selectedShop === item.id && styles.activeShopOptionText
                                ]}>
                                    {item.name}
                                </Text>
                                {selectedShop === item.id && (
                                    <View style={styles.checkmark}>
                                        <Text style={styles.checkmarkText}>✓</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </Modal>

            {/* Price Selection Modal */}
            <Modal
                visible={priceModalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select Price Range</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => {
                                setPriceModalVisible(false);
                                setPriceSearchQuery('');
                            }}
                        >
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color="#666" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search price ranges..."
                            value={priceSearchQuery}
                            onChangeText={setPriceSearchQuery}
                            placeholderTextColor="#999"
                        />
                    </View>

                    <FlatList
                        data={filteredPrices}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.shopOption,
                                    selectedPrice === item.id && styles.activeShopOption
                                ]}
                                onPress={() => handlePriceSelect(item.id)}
                            >
                                <Ionicons name="pricetag-outline" size={20} color={selectedPrice === item.id ? '#007AFF' : '#666'} />
                                <View style={styles.priceOptionContent}>
                                    <Text style={[
                                        styles.shopOptionText,
                                        selectedPrice === item.id && styles.activeShopOptionText
                                    ]}>
                                        {item.label}
                                    </Text>
                                    <Text style={[
                                        styles.priceRangeText,
                                        selectedPrice === item.id && styles.activePriceRangeText
                                    ]}>
                                        {item.range}
                                    </Text>
                                </View>
                                {selectedPrice === item.id && (
                                    <View style={styles.checkmark}>
                                        <Text style={styles.checkmarkText}>✓</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </Modal>
        </View>
    );
};

function getStyles(theme: any) {
    return StyleSheet.create({
        container: {
            backgroundColor: '#fff',
            padding: 16,
            borderRadius: 10
        },
        filterRow: {
            flexDirection: 'row',
            gap: 12,
        },
        secondFilterRow: {
            marginTop: 16,
        },
        filterItem: {
            flex: 1,
        },
        filterLabel: {
            fontSize: 14,
            fontWeight: '600',
            color: '#333',
            marginBottom: 8,
        },
        dropdownContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 6,
        },
        sortOption: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: '#E0E0E0',
            backgroundColor: '#F8F9FA',
            gap: 4,
        },
        activeSortOption: {
            borderColor: '#007AFF',
            backgroundColor: '#E3F2FD',
        },
        sortOptionText: {
            fontSize: 12,
            color: '#666',
            fontWeight: '500',
        },
        activeSortOptionText: {
            color: '#007AFF',
            fontWeight: '600',
        },
        shopSelector: {
            borderWidth: 1,
            borderColor: '#E0E0E0',
            borderRadius: 8,
            backgroundColor: '#F8F9FA',
        },
        shopSelectorContent: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 12,
            gap: 8,
        },
        shopSelectorText: {
            flex: 1,
            fontSize: 14,
            color: '#333',
            fontWeight: '500',
        },
        activeFilters: {
            marginTop: 16,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: '#F0F0F0',
        },
        activeFiltersLabel: {
            fontSize: 12,
            color: '#666',
            marginBottom: 8,
        },
        activeFilterTags: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
        },
        filterTag: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 20,
            backgroundColor: '#E3F2FD',
            borderWidth: 1,
            borderColor: '#007AFF',
            gap: 6,
        },
        filterTagText: {
            fontSize: 12,
            color: '#007AFF',
            fontWeight: '500',
        },
        modalContainer: {
            flex: 1,
            backgroundColor: '#fff',
        },
        modalHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 16,
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            borderBottomColor: '#F0F0F0',
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: '#333',
        },
        closeButton: {
            padding: 4,
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            margin: 16,
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderWidth: 1,
            borderColor: '#E0E0E0',
            borderRadius: 8,
            backgroundColor: '#F8F9FA',
            gap: 8,
        },
        searchInput: {
            flex: 1,
            fontSize: 16,
            color: '#333',
        },
        shopOption: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 16,
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            borderBottomColor: '#F5F5F5',
            gap: 12,
        },
        activeShopOption: {
            backgroundColor: '#F0F8FF',
        },
        shopOptionText: {
            flex: 1,
            fontSize: 16,
            color: '#333',
        },
        activeShopOptionText: {
            color: '#007AFF',
            fontWeight: '600',
        },
        checkmark: {
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: '#007AFF',
            alignItems: 'center',
            justifyContent: 'center',
        },
        checkmarkText: {
            color: '#fff',
            fontSize: 12,
            fontWeight: 'bold',
        },
        priceOptionContent: {
            flex: 1,
        },
        priceRangeText: {
            fontSize: 14,
            color: '#999',
            marginTop: 2,
        },
        activePriceRangeText: {
            color: '#007AFF',
        },
    });
}

export default FilterSortComponent;