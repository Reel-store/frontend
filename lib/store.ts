import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, CartItem, Product } from './types';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user: User, token: string) => {
        set({ user, token });
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('auth_user', JSON.stringify(user));
        }
      },
      clearAuth: () => {
        set({ user: null, token: null });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'auth_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
      },
    }),
    { name: 'auth-store' }
  )
);

// ── Cart Store ────────────────────────────────────────────────────────────────
// Cart is scoped to one storefront handle at a time.

interface CartState {
  handle: string | null;
  items: CartItem[];
  addItem: (product: Product, handle: string) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  totalCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      handle: null,
      items: [],

      addItem: (product, handle) => {
        set((state) => {
          // If cart is for a different storefront, start fresh
          if (state.handle && state.handle !== handle) {
            return { handle, items: [{ product, quantity: 1 }] };
          }
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              handle,
              items: state.items.map((i) =>
                i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { handle, items: [...state.items, { product, quantity: 1 }] };
        });
      },

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.product.id !== productId) })),

      updateQty: (productId, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.product.id !== productId)
              : state.items.map((i) =>
                  i.product.id === productId ? { ...i, quantity: qty } : i
                ),
        })),

      clearCart: () => set({ handle: null, items: [] }),

      totalCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'cart-store' }
  )
);
