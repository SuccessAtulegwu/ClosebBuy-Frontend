import { sampleProducts } from "@/constants/app.data";
import { ThemeContext } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useContext, useState, useEffect } from "react";
import { FlatList, TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";
import FilterSortComponent from "./FilterSortComponent";
import { ThemedView } from "./ThemedView";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCart as addToCartAction, incrementQuantity, decrementQuantity } from "@/redux/slices/cartSlice";
import { FavoritesStorageService, FavoriteProduct } from "@/utils/favoritesStorage";

interface Favorites {
    [productId: string]: boolean;
}

export function SavedItems({ products = sampleProducts, title = "Popular Deals" }) {
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector((state) => state.cart.items);
    const [favorites, setFavorites] = useState<Favorites>({});
    const [favoriteProducts, setFavoriteProducts] = useState<FavoriteProduct[]>([]);

    // Load favorites from storage on mount
    useEffect(() => {
        loadFavorites();
    }, []);

    // Refresh favorites when component is focused
    useEffect(() => {
        const interval = setInterval(() => {
            loadFavorites();
        }, 2000); // Refresh every 2 seconds

        return () => clearInterval(interval);
    }, []);

    const loadFavorites = async () => {
        try {
            const favs = await FavoritesStorageService.getFavorites();
            setFavoriteProducts(favs);
            
            const favoritesMap: Favorites = {};
            favs.forEach(fav => {
                favoritesMap[fav.id] = true;
            });
            setFavorites(favoritesMap);
        } catch (error) {
            console.error('Error loading favorites:', error);
        }
    };

    // Get quantity for a product from Redux cart
    const getQuantity = (productId: number) => {
        const item = cartItems.find(item => item.id === productId);
        return item ? item.quantity : 0;
    };


    const toggleFavorite = async (product: any) => {
        try {
            await FavoritesStorageService.removeFavorite(product.id);
            // Reload favorites to update the list
            await loadFavorites();
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    const addToCart = (product: any) => {
        dispatch(addToCartAction({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            inStock: product.inStock,
            category: product.category,
        }));
    };

    const handleIncrement = (productId: number) => {
        dispatch(incrementQuantity(productId));
    };

    const handleDecrement = (productId: number) => {
        dispatch(decrementQuantity(productId));
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
        const quantity = getQuantity(product.id);
        const isFavorite = favorites[product.id] || false;

        return (
            <View style={styles.productCard}>
                {/* Favorite Button */}
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => toggleFavorite(product)}
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
                                    onPress={() => handleDecrement(product.id)}
                                >
                                    <Text style={styles.quantityButtonText}>-</Text>
                                </TouchableOpacity>

                                <Text style={styles.quantityText}>{quantity}</Text>

                                <TouchableOpacity
                                    style={[styles.quantityButton, styles.addButton]}
                                    onPress={() => handleIncrement(product.id)}
                                >
                                    <Text style={styles.addButtonText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={styles.addToCartButton}
                                onPress={() => addToCart(product)}
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
        <ThemedView style={styles.container}>
            {favoriteProducts.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="heart-outline" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>No favorites yet</Text>
                    <Text style={styles.emptySubtext}>Tap the heart icon on products to add them here</Text>
                </View>
            ) : (
                <FlatList
                    data={favoriteProducts}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.productGrid}
                    columnWrapperStyle={styles.productRow}
                    renderItem={({ item }) => <ProductCard product={item} />}
                />
            )}
        </ThemedView>
    );
};

function getStyles(theme: any) {
    return StyleSheet.create({
        container: {
            padding: 5,
            backgroundColor: theme.background,
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 60,
        },
        emptyText: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.text,
            marginTop: 16,
        },
        emptySubtext: {
            fontSize: 14,
            color: '#999',
            marginTop: 8,
            textAlign: 'center',
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
            backgroundColor: theme.background,
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