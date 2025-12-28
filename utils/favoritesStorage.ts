// Favorites Storage Service for User's Favorite Products
// Saves favorite products locally on the device using AsyncStorage

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  FAVORITES: '@closebuy_favorites',
};

export interface FavoriteProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  inStock: boolean;
  category?: string;
  isOnSale?: boolean;
  saleLabel?: string;
  addedAt: string; // ISO timestamp
}

export const FavoritesStorageService = {
  /**
   * Add a product to favorites
   */
  addFavorite: async (product: Omit<FavoriteProduct, 'addedAt'>): Promise<void> => {
    try {
      const favorites = await FavoritesStorageService.getFavorites();
      
      // Check if already favorited
      const exists = favorites.find(fav => fav.id === product.id);
      if (exists) {
        return; // Already in favorites
      }

      const newFavorite: FavoriteProduct = {
        ...product,
        addedAt: new Date().toISOString(),
      };

      favorites.push(newFavorite);
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.FAVORITES,
        JSON.stringify(favorites)
      );
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  },

  /**
   * Remove a product from favorites
   */
  removeFavorite: async (productId: number): Promise<void> => {
    try {
      const favorites = await FavoritesStorageService.getFavorites();
      const filtered = favorites.filter(fav => fav.id !== productId);
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.FAVORITES,
        JSON.stringify(filtered)
      );
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  },

  /**
   * Get all favorite products
   */
  getFavorites: async (): Promise<FavoriteProduct[]> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  },

  /**
   * Check if a product is favorited
   */
  isFavorite: async (productId: number): Promise<boolean> => {
    try {
      const favorites = await FavoritesStorageService.getFavorites();
      return favorites.some(fav => fav.id === productId);
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  },

  /**
   * Toggle favorite status
   */
  toggleFavorite: async (product: Omit<FavoriteProduct, 'addedAt'>): Promise<boolean> => {
    try {
      const isFav = await FavoritesStorageService.isFavorite(product.id);
      
      if (isFav) {
        await FavoritesStorageService.removeFavorite(product.id);
        return false; // No longer favorite
      } else {
        await FavoritesStorageService.addFavorite(product);
        return true; // Now favorite
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  },

  /**
   * Clear all favorites
   */
  clearAllFavorites: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.FAVORITES);
    } catch (error) {
      console.error('Error clearing favorites:', error);
      throw error;
    }
  },

  /**
   * Get favorites count
   */
  getFavoritesCount: async (): Promise<number> => {
    try {
      const favorites = await FavoritesStorageService.getFavorites();
      return favorites.length;
    } catch (error) {
      console.error('Error getting favorites count:', error);
      return 0;
    }
  },
};

