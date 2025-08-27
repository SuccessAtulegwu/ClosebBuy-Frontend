
export interface Category {
    id: number;
    name: string;
    icon: string;
    library: 'Ionicons' | 'MaterialIcons' | 'Feather';
    color: string;
}

export const categoriesList: Category[] = [
    { id: 1, name: 'Groceries', icon: 'leaf', library: 'Ionicons', color: '#5cb85c' },
    { id: 2, name: 'Fresh Produce', icon: 'nutrition-outline', library: 'Ionicons', color: '#27ae60' },
    { id: 3, name: 'Fruits', icon: 'leaf-outline', library: 'Ionicons', color: '#e74c3c' },
    { id: 4, name: 'Vegetables', icon: 'flower-outline', library: 'Ionicons', color: '#2ecc71' },
    { id: 5, name: 'Meat & Poultry', icon: 'restaurant-outline', library: 'Ionicons', color: '#c0392b' },
    { id: 6, name: 'Seafood', icon: 'fish-outline', library: 'Ionicons', color: '#3498db' },
    { id: 7, name: 'Dairy & Eggs', icon: 'egg-outline', library: 'Ionicons', color: '#45b7d1' },
    { id: 8, name: 'Bakery', icon: 'pizza-outline', library: 'Ionicons', color: '#f9ca24' },
    { id: 9, name: 'Frozen Foods', icon: 'snow-outline', library: 'Ionicons', color: '#74b9ff' },
    { id: 10, name: 'Canned Goods', icon: 'archive-outline', library: 'Ionicons', color: '#fdcb6e' },

    // Beverages
    { id: 11, name: 'Beverages', icon: 'wine-outline', library: 'Ionicons', color: '#4ecdc4' },
    { id: 12, name: 'Water', icon: 'water-outline', library: 'Ionicons', color: '#74b9ff' },
    { id: 13, name: 'Soft Drinks', icon: 'cafe-outline', library: 'Ionicons', color: '#ff6348' },
    { id: 14, name: 'Coffee & Tea', icon: 'cafe', library: 'Ionicons', color: '#8b4513' },
    { id: 15, name: 'Alcohol', icon: 'wine', library: 'Ionicons', color: '#8e44ad' },
    { id: 16, name: 'Energy Drinks', icon: 'flash-outline', library: 'Ionicons', color: '#f39c12' },

    // Snacks & Confectionery
    { id: 17, name: 'Snacks', icon: 'fast-food-outline', library: 'Ionicons', color: '#ff6b6b' },
    { id: 18, name: 'Chips & Crackers', icon: 'fast-food', library: 'Ionicons', color: '#ff7675' },
    { id: 19, name: 'Cookies & Biscuits', icon: 'pizza', library: 'Ionicons', color: '#d63031' },
    { id: 20, name: 'Candy & Sweets', icon: 'ice-cream-outline', library: 'Ionicons', color: '#fd79a8' },
    { id: 21, name: 'Chocolate', icon: 'heart', library: 'Ionicons', color: '#6f4e37' },
    { id: 22, name: 'Nuts & Seeds', icon: 'ellipse-outline', library: 'Ionicons', color: '#8d6e63' },
    { id: 23, name: 'Dried Fruits', icon: 'flower-outline', library: 'Ionicons', color: '#ff9800' },

    // Personal Care & Health
    { id: 24, name: 'Beauty & Cosmetics', icon: 'brush-outline', library: 'Ionicons', color: '#6c5ce7' },
    { id: 25, name: 'Skincare', icon: 'sparkles-outline', library: 'Ionicons', color: '#fd79a8' },
    { id: 26, name: 'Hair Care', icon: 'cut-outline', library: 'Ionicons', color: '#9b59b6' },
    { id: 27, name: 'Oral Care', icon: 'brush', library: 'Ionicons', color: '#00cec9' },
    { id: 28, name: 'Health & Medicine', icon: 'medical-outline', library: 'Ionicons', color: '#e74c3c' },
    { id: 29, name: 'Vitamins', icon: 'fitness-outline', library: 'Ionicons', color: '#2ecc71' },
    { id: 30, name: 'Personal Hygiene', icon: 'body-outline', library: 'Ionicons', color: '#74b9ff' },

    // Household & Cleaning
    { id: 31, name: 'Cleaning Supplies', icon: 'brush', library: 'Ionicons', color: '#00b894' },
    { id: 32, name: 'Laundry', icon: 'shirt-outline', library: 'Ionicons', color: '#0984e3' },
    { id: 33, name: 'Paper Products', icon: 'receipt-outline', library: 'Ionicons', color: '#636e72' },
    { id: 34, name: 'Trash & Storage', icon: 'trash-outline', library: 'Ionicons', color: '#2d3436' },
    { id: 35, name: 'Air Fresheners', icon: 'leaf', library: 'Ionicons', color: '#55a3ff' },

    // Home & Garden
    { id: 36, name: 'Home Decor', icon: 'home-outline', library: 'Ionicons', color: '#e17055' },
    { id: 37, name: 'Furniture', icon: 'bed-outline', library: 'Ionicons', color: '#9b59b6' },
    { id: 38, name: 'Kitchen Appliances', icon: 'restaurant', library: 'Ionicons', color: '#4a90e2' },
    { id: 39, name: 'Garden & Plants', icon: 'flower', library: 'Ionicons', color: '#27ae60' },
    { id: 40, name: 'Tools & Hardware', icon: 'build-outline', library: 'Ionicons', color: '#7f8c8d' },
    { id: 41, name: 'Lighting', icon: 'bulb-outline', library: 'Ionicons', color: '#f1c40f' },

    // Fashion & Accessories
    { id: 42, name: 'Fashion', icon: 'shirt', library: 'Ionicons', color: '#c44569' },
    { id: 43, name: 'Men\'s Clothing', icon: 'man-outline', library: 'Ionicons', color: '#2c3e50' },
    { id: 44, name: 'Women\'s Clothing', icon: 'woman-outline', library: 'Ionicons', color: '#e91e63' },
    { id: 45, name: 'Shoes', icon: 'footsteps-outline', library: 'Ionicons', color: '#795548' },
    { id: 46, name: 'Accessories', icon: 'watch-outline', library: 'Ionicons', color: '#ff6348' },
    { id: 47, name: 'Bags & Luggage', icon: 'bag-outline', library: 'Ionicons', color: '#8e44ad' },

    // Electronics & Tech
    { id: 48, name: 'Electronics', icon: 'phone-portrait-outline', library: 'Ionicons', color: '#2d3436' },
    { id: 49, name: 'Mobile Phones', icon: 'phone-portrait', library: 'Ionicons', color: '#00cec9' },
    { id: 50, name: 'Computers & Tablets', icon: 'laptop-outline', library: 'Ionicons', color: '#636e72' },
    { id: 51, name: 'TV & Audio', icon: 'tv-outline', library: 'Ionicons', color: '#2c3e50' },
    { id: 52, name: 'Gaming', icon: 'game-controller-outline', library: 'Ionicons', color: '#9c88ff' },
    { id: 53, name: 'Cameras', icon: 'camera-outline', library: 'Ionicons', color: '#ff6b6b' },
    { id: 54, name: 'Chargers & Cables', icon: 'power-outline', library: 'Ionicons', color: '#34495e' },

    // Sports & Fitness
    { id: 55, name: 'Sports Equipment', icon: 'football-outline', library: 'Ionicons', color: '#f0932b' },
    { id: 56, name: 'Fitness', icon: 'fitness', library: 'Ionicons', color: '#e74c3c' },
    { id: 57, name: 'Outdoor Activities', icon: 'trail-sign-outline', library: 'Ionicons', color: '#27ae60' },
    { id: 58, name: 'Cycling', icon: 'bicycle-outline', library: 'Ionicons', color: '#3498db' },
    { id: 59, name: 'Water Sports', icon: 'boat-outline', library: 'Ionicons', color: '#74b9ff' },

    // Books, Media & Stationery  
    { id: 60, name: 'Books', icon: 'book-outline', library: 'Ionicons', color: '#00cec9' },
    { id: 61, name: 'Articles', icon: 'newspaper-outline', library: 'Ionicons', color: '#fd79a8' },
    { id: 62, name: 'Magazines', icon: 'library-outline', library: 'Ionicons', color: '#e17055' },
    { id: 63, name: 'Stationery', icon: 'pencil-outline', library: 'Ionicons', color: '#fdcb6e' },
    { id: 64, name: 'Art Supplies', icon: 'color-palette-outline', library: 'Ionicons', color: '#e17055' },
    { id: 65, name: 'Office Supplies', icon: 'briefcase-outline', library: 'Ionicons', color: '#636e72' },

    // Toys & Games
    { id: 66, name: 'Toys', icon: 'cube-outline', library: 'Ionicons', color: '#eb4d4b' },
    { id: 67, name: 'Board Games', icon: 'grid-outline', library: 'Ionicons', color: '#9b59b6' },
    { id: 68, name: 'Educational Toys', icon: 'school-outline', library: 'Ionicons', color: '#3498db' },
    { id: 69, name: 'Action Figures', icon: 'person-outline', library: 'Ionicons', color: '#e74c3c' },
    { id: 70, name: 'Puzzles', icon: 'grid-outline', library: 'Ionicons', color: '#f39c12' },

    // Baby & Kids
    { id: 71, name: 'Baby Care', icon: 'heart-outline', library: 'Ionicons', color: '#ff7675' },
    { id: 72, name: 'Baby Food', icon: 'nutrition', library: 'Ionicons', color: '#55a3ff' },
    { id: 73, name: 'Diapers', icon: 'medkit-outline', library: 'Ionicons', color: '#fd79a8' },
    { id: 74, name: 'Baby Formula', icon: 'flask-outline', library: 'Ionicons', color: '#74b9ff' },
    { id: 75, name: 'Kids Clothing', icon: 'shirt-outline', library: 'Ionicons', color: '#ff6348' },

    // Pet Care
    { id: 76, name: 'Pet Supplies', icon: 'paw-outline', library: 'Ionicons', color: '#55a3ff' },
    { id: 77, name: 'Pet Food', icon: 'fast-food-outline', library: 'Ionicons', color: '#8e44ad' },
    { id: 78, name: 'Pet Toys', icon: 'baseball-outline', library: 'Ionicons', color: '#f0932b' },
    { id: 79, name: 'Pet Grooming', icon: 'cut-outline', library: 'Ionicons', color: '#00cec9' },

    // Automotive
    { id: 80, name: 'Car Accessories', icon: 'car-outline', library: 'Ionicons', color: '#2c3e50' },
    { id: 81, name: 'Car Care', icon: 'build', library: 'Ionicons', color: '#3498db' },
    { id: 82, name: 'Motor Oil', icon: 'water-outline', library: 'Ionicons', color: '#34495e' },

    // Pharmacy
    { id: 83, name: 'Prescription', icon: 'medical', library: 'Ionicons', color: '#e74c3c' },
    { id: 84, name: 'First Aid', icon: 'bandage-outline', library: 'Ionicons', color: '#27ae60' },
    { id: 85, name: 'Medical Devices', icon: 'pulse-outline', library: 'Ionicons', color: '#e91e63' },

    // Seasonal & Special
    { id: 86, name: 'Holiday Items', icon: 'gift-outline', library: 'Ionicons', color: '#ff6348' },
    { id: 87, name: 'Party Supplies', icon: 'balloon-outline', library: 'Ionicons', color: '#fd79a8' },
    { id: 88, name: 'Gift Cards', icon: 'card-outline', library: 'Ionicons', color: '#f39c12' },
    { id: 89, name: 'Travel Essentials', icon: 'airplane-outline', library: 'Ionicons', color: '#74b9ff' }
];

export const sampleProducts = [
  {
    id: 1,
    name: 'Strawberries',
    price: 10,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=200&h=200&fit=crop',
    isOnSale: true,
    saleLabel: '50% OFF',
    category: 'fruits',
    inStock: true,
  },
  {
    id: 2,
    name: 'Fried Chips',
    price: 12,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&h=200&fit=crop',
    isOnSale: false,
    category: 'snacks',
    inStock: true,
  },
  {
    id: 3,
    name: 'Comfortable Chair',
    price: 299,
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop',
    isOnSale: false,
    category: 'furniture',
    inStock: true,
  },
  {
    id: 4,
    name: 'Washing Machine',
    price: 599,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop',
    isOnSale: false,
    category: 'appliances',
    inStock: false,
  },
  {
    id: 5,
    name: 'Fresh Bananas',
    price: 8,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&h=200&fit=crop',
    isOnSale: true,
    saleLabel: '30% OFF',
    category: 'fruits',
    inStock: true,
  },
  {
    id: 6,
    name: 'Coffee Beans',
    price: 25,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&h=200&fit=crop',
    isOnSale: false,
    category: 'beverages',
    inStock: true,
  },
];
