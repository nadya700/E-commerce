export interface Product {
  id: number;
  name: string;
  slug: string;
  category: 'Köynək' | 'Şalvar' | 'Pencək' | 'Don' | 'Sviter' | 'Ayaqqabı' | 'Aksessuar';
  gender: 'Kişi' | 'Qadın' | 'Uniseks';
  price: number;
  originalPrice?: number;
  description: string;
  composition: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  images: string[];
  stock: number;
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  tags: string[];
}

export interface CartItem {
  id: string; // unique item instance id
  productId: number;
  product: Product;
  selectedSize: string;
  selectedColor: { name: string; hex: string };
  quantity: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentMethod: 'card' | 'cash';
  userEmail: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  savedAddresses?: ShippingAddress[];
}

export interface FilterState {
  search: string;
  category: string;
  gender: string;
  minPrice: number;
  maxPrice: number;
  selectedSize: string;
  selectedColor: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}
