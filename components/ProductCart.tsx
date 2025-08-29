import { sampleProducts } from "@/constants/app.data";
import { ThemeContext } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useContext, useState } from "react";
import { FlatList, TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";
import FilterSortComponent from "./FilterSortComponent";

interface Cart {
    [productId: string]: number;
}

interface Favorites {
    [productId: string]: boolean;
}
export function ProductCart({ products = sampleProducts, title = "Popular Deals" }) {
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const [cart, setCart] = useState<Cart>({});
    const [favorites, setFavorites] = useState<Favorites>({});
    const [filteredProducts, setFilteredProducts] = useState(products);


    const updateCart = (productId: any, quantity: any) => {
        setCart(prev => ({
            ...prev,
            [productId]: Math.max(0, quantity)
        }));
    };

    const toggleFavorite = (productId: number) => {
        setFavorites(prev => ({
            ...prev,
            [productId]: !prev[productId]
        }));
    };

    const addToCart = (productId: any) => {
        const currentQuantity = cart[productId] || 0;
        updateCart(productId, currentQuantity + 1);
    };

    const handleFilterChange = (filters: any) => {
        // Apply filters to your data
        //console.log('Filters changed:', filters);
        // Example: filterProducts(filters.sortBy, filters.shopId);
        let filtered = products;

        // Apply stock filter
        /*  if (filters.sortBy !== 'all') {
             filtered = filtered.filter(product => product.stock === filters.sortBy);
         } */

        // Apply shop filter
        /*  if (filters.shopId !== 'all') {
             filtered = filtered.filter(product => product.shopId === filters.shopId);
         } */

        // Apply price filter
        if (filters.priceRange !== 'all') {
            filtered = filtered.filter(product => {
                const price = product.price;
                switch (filters.priceRange) {
                    case 'under_10': return price < 10;
                    case '10_50': return price >= 10 && price <= 50;
                    case '50_100': return price >= 50 && price <= 100;
                    case '100_200': return price >= 100 && price <= 200;
                    case 'over_200': return price > 200;
                    default: return true;
                }
            });
        }

        setFilteredProducts(filtered);
    };
    const renderStars = (rating: any) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <Ionicons key={i} name="star" size={12} color="#ffa500" />
                );
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <Ionicons key={i} name="star-half" size={12} color="#ffa500" />
                );
            } else {
                stars.push(
                    <Ionicons key={i} name="star-outline" size={12} color="#ddd" />
                );
            }
        }
        return stars;
    };

    const ProductCard = ({ product }: { product: any }) => {
        const quantity = cart[product.id] || 0;
        const isFavorite = favorites[product.id] || false;

        return (
            <View style={styles.productCard}>
                {/* Favorite Button */}
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => toggleFavorite(product.id)}
                >
                    <Ionicons
                        name={isFavorite ? "heart" : "heart-outline"}
                        size={20}
                        color={isFavorite ? "#ff4757" : "#999"}
                    />
                </TouchableOpacity>

                {/* Sale Badge */}
                {product.isOnSale && (
                    <View style={styles.saleBadge}>
                        <Text style={styles.saleText}>{product.saleLabel}</Text>
                    </View>
                )}

                {/* Product Image */}
                <Image source={{ uri: product.image }} style={styles.productImage} />

                {/* Product Info */}
                <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>
                        {product.name}
                    </Text>

                    <View style={styles.priceRatingRow}>
                        <Text style={styles.price}>₦{product.price}</Text>

                        <View style={styles.ratingContainer}>
                            <Text style={styles.ratingText}>{product.rating}</Text>
                            <View style={styles.starsContainer}>
                                {renderStars(product.rating)}
                            </View>
                        </View>
                    </View>

                    {/* Cart Controls */}
                    {product.inStock ? (
                        quantity > 0 ? (
                            <View style={styles.quantityControls}>
                                <TouchableOpacity
                                    style={styles.quantityButton}
                                    onPress={() => updateCart(product.id, quantity - 1)}
                                >
                                    <Text style={styles.quantityButtonText}>-</Text>
                                </TouchableOpacity>

                                <Text style={styles.quantityText}>{quantity}</Text>

                                <TouchableOpacity
                                    style={[styles.quantityButton, styles.addButton]}
                                    onPress={() => updateCart(product.id, quantity + 1)}
                                >
                                    <Text style={styles.addButtonText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={styles.addToCartButton}
                                onPress={() => addToCart(product.id)}
                            >
                                <Text style={styles.addToCartText}>Add to cart</Text>
                            </TouchableOpacity>
                        )
                    ) : (
                        <View style={styles.outOfStockButton}>
                            <Text style={styles.outOfStockText}>Out of Stock</Text>
                        </View>
                    )}
                </View>
            </View>
        );
    };



    return (
        <View style={styles.container}>
            {/* Section Header */}
            <View style={styles.sectionHeader}>
                {/*   <Text style={styles.sectionTitle}>{title}</Text> */}
                <FilterSortComponent onFilterChange={handleFilterChange} />
                {/* <TouchableOpacity style={styles.seeAllButton}>
                    <Ionicons name="chevron-forward" size={20} color={theme.text} />
                </TouchableOpacity> */}
            </View>

            {/* Products Grid */}
            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.productGrid}
                columnWrapperStyle={styles.productRow}
                renderItem={({ item }) => <ProductCard product={item} />}
            />
        </View>
    );
};

function getStyles(theme: any) {
    return StyleSheet.create({
        container: {
            padding: 5,
            backgroundColor: theme.background,
        },
        sectionHeader: {
            marginBottom: 20,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.text,
        },
        seeAllButton: {
            padding: 5,
        },
        productGrid: {
            paddingBottom: 100,
        },
        productRow: {
            justifyContent: 'space-between',
            marginBottom: 20,
        },
        productCard: {
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 10,
            width: '48%',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
            position: 'relative',
        },
        favoriteButton: {
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 15,
            padding: 5,
        },
        saleBadge: {
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: '#ff4757',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
            transform: [{ rotate: '15deg' }],
            zIndex: 2,
        },
        saleText: {
            color: 'white',
            fontSize: 10,
            fontWeight: 'bold',
        },
        productImage: {
            width: '100%',
            height: 100,
            borderRadius: 8,
            marginBottom: 10,
            resizeMode: 'cover',
        },
        productInfo: {
            flex: 1,
        },
        productName: {
            fontSize: 14,
            fontWeight: '500',
            color: '#333',
            marginBottom: 8,
            lineHeight: 18,
        },
        priceRatingRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
        },
        price: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#333',
        },
        ratingContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        ratingText: {
            fontSize: 12,
            color: '#666',
            marginRight: 4,
        },
        starsContainer: {
            flexDirection: 'row',
        },
        quantityControls: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        quantityButton: {
            backgroundColor: '#ff4757',
            borderRadius: 15,
            width: 30,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
        },
        addButton: {
            backgroundColor: '#5cb85c',
        },
        quantityButtonText: {
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
        },
        addButtonText: {
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
        },
        quantityText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#333',
        },
        addToCartButton: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: '#ffa500',
            borderRadius: 20,
            paddingVertical: 8,
            paddingHorizontal: 16,
            alignItems: 'center',
        },
        addToCartText: {
            color: '#ffa500',
            fontSize: 12,
            fontWeight: '500',
        },
        outOfStockButton: {
            backgroundColor: '#f0f0f0',
            borderRadius: 20,
            paddingVertical: 8,
            paddingHorizontal: 16,
            alignItems: 'center',
        },
        outOfStockText: {
            color: '#999',
            fontSize: 12,
            fontWeight: '500',
        },
    });
}