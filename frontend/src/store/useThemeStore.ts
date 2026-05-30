import { create } from 'zustand';
import api from '../api/axios';

interface ThemeConfig {
  primaryColor: string;
  fontSize: number;
  layout: 'left' | 'right';
  isDarkMode: boolean;
  fontFamily: 'sans' | 'serif' | 'mono';
}

export interface ThemeDesignConfig {
  primaryColor: string;
  fontFamily: 'sans' | 'serif' | 'mono';
  layoutType: 'sidebar-left' | 'sidebar-right' | 'centered';
  darkModeDefault: boolean;
  backgroundStyle: 'dots' | 'grid' | 'none';
}

export interface Theme {
  id: string;
  title: string;
  description: string;
  descriptionLong?: string;
  features?: string[];
  version?: string;
  price: number;
  imageUrl: string;
  author: string;
  category: string;
  averageRating?: number;
  reviewCount?: number;
  designConfig?: ThemeDesignConfig;
}

export interface Review {
  id: number;
  userId: number;
  userName: string;
  themeId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface PurchasedTheme extends Theme {
  licenseKey: string;
  downloadUrl: string;
  purchasedAt: string;
}

interface ThemeStore {
  themes: Theme[];
  selectedTheme: Theme | null;
  config: ThemeConfig;
  view: 'home' | 'preview' | 'dashboard' | 'admin';
  cart: Theme[];
  purchased: PurchasedTheme[];
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  reviews: Review[];
  reviewsLoading: boolean;
  previewMode: 'standard' | 'velog' | 'tistory';

  setThemes: (themes: Theme[]) => void;
  setSelectedTheme: (theme: Theme | null) => void;
  setPreviewMode: (mode: 'standard' | 'velog' | 'tistory') => void;
  updateConfig: (newConfig: Partial<ThemeConfig>) => void;
  setView: (view: 'home' | 'preview' | 'dashboard' | 'admin') => void;
  createTheme: (theme: Partial<Theme>) => Promise<void>;
  updateThemeAdmin: (id: string, theme: Partial<Theme>) => Promise<void>;
  deleteTheme: (id: string) => Promise<void>;
  fetchThemes: () => Promise<void>;
  addToCart: (theme: Theme) => void;
  removeFromCart: (themeId: string) => void;
  clearCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  setCheckoutOpen: (isOpen: boolean) => void;
  addPurchased: (themes: PurchasedTheme[]) => void;
  fetchPurchased: () => Promise<void>;
  fetchReviews: (themeId: string) => Promise<void>;
  submitReview: (themeId: string, rating: number, comment: string) => Promise<void>;
  updateReview: (reviewId: number, rating: number, comment: string) => Promise<void>;
  deleteReview: (reviewId: number, themeId: string) => Promise<void>;
}

const defaultConfig: ThemeConfig = {
  primaryColor: '#0070f3',
  fontSize: 16,
  layout: 'right',
  isDarkMode: false,
  fontFamily: 'sans',
};

export const useThemeStore = create<ThemeStore>((set, get) => ({
  themes: [],
  selectedTheme: null,
  config: defaultConfig,
  view: 'home',
  cart: [],
  purchased: [],
  isCartOpen: false,
  isCheckoutOpen: false,
  reviews: [],
  reviewsLoading: false,
  previewMode: 'standard',

  setThemes: (themes) => set({ themes }),
  setSelectedTheme: (theme) => set((state) => {
    if (!theme) return { selectedTheme: null, view: 'home', reviews: [] };
    
    const dc = theme.designConfig;
    const newConfig: ThemeConfig = {
      primaryColor: dc?.primaryColor || defaultConfig.primaryColor,
      fontSize: state.config.fontSize,
      layout: dc?.layoutType === 'sidebar-left' ? 'left' : 'right',
      isDarkMode: dc?.darkModeDefault ?? defaultConfig.isDarkMode,
      fontFamily: dc?.fontFamily || defaultConfig.fontFamily,
    };

    return {
      selectedTheme: theme,
      view: 'preview',
      config: newConfig,
      reviews: [],
      previewMode: 'standard'
    };
  }),
  setPreviewMode: (mode) => set({ previewMode: mode }),
  updateConfig: (newConfig) => set((state) => ({ config: { ...state.config, ...newConfig } })),
  setView: (view) => set({ view, isCartOpen: false, isCheckoutOpen: false, selectedTheme: null, previewMode: 'standard' }),
  fetchThemes: async () => {
    try {
      const response = await api.get('/api/themes');
      set({ themes: response.data });
    } catch (error) {
      console.error('Failed to fetch themes', error);
    }
  },
  createTheme: async (theme) => {
    await api.post('/api/themes', theme);
    const response = await api.get('/api/themes');
    set({ themes: response.data });
  },
  updateThemeAdmin: async (id, theme) => {
    await api.put(`/api/themes/${id}`, theme);
    const response = await api.get('/api/themes');
    set({ themes: response.data });
  },
  deleteTheme: async (id) => {
    await api.delete(`/api/themes/${id}`);
    const response = await api.get('/api/themes');
    set({ themes: response.data });
  },
  addToCart: (theme) => set((state) => ({
    cart: state.cart.find(item => item.id === theme.id) || state.purchased.find(item => item.id === theme.id)
      ? state.cart
      : [...state.cart, theme],
    isCartOpen: true
  })),
  removeFromCart: (themeId) => set((state) => ({
    cart: state.cart.filter(item => item.id !== themeId)
  })),
  clearCart: () => set({ cart: [] }),
  setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  setCheckoutOpen: (isOpen) => set({ isCheckoutOpen: isOpen, isCartOpen: false }),
  addPurchased: (newPurchased) => set((state) => ({
    purchased: [...state.purchased, ...newPurchased],
    cart: [],
    isCheckoutOpen: false,
    view: 'dashboard'
  })),
  fetchPurchased: async () => {
    try {
      const response = await api.get('/api/purchases/my');
      set({ purchased: response.data });
    } catch (error) {
      console.error('Failed to fetch purchased themes', error);
    }
  },
  fetchReviews: async (themeId) => {
    set({ reviewsLoading: true });
    try {
      const response = await api.get(`/api/themes/${themeId}/reviews`);
      set({ reviews: response.data });
    } catch (error) {
      console.error('Failed to fetch reviews', error);
    } finally {
      set({ reviewsLoading: false });
    }
  },
  submitReview: async (themeId, rating, comment) => {
    await api.post('/api/reviews', { themeId, rating, comment });
    await get().fetchReviews(themeId);
  },
  updateReview: async (reviewId, rating, comment) => {
    const themeId = get().selectedTheme?.id;
    await api.put(`/api/reviews/${reviewId}`, { rating, comment });
    if (themeId) await get().fetchReviews(themeId);
  },
  deleteReview: async (reviewId, themeId) => {
    await api.delete(`/api/reviews/${reviewId}`);
    await get().fetchReviews(themeId);
  },
}));
