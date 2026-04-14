import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image: string | null;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const qty = item.quantity || 12;
        // Ensure quantity is multiple of 12
        const validatedQty = Math.ceil(qty / 12) * 12;

        set((state) => {
          const existing = state.items.find(i => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map(i => 
                i.productId === item.productId 
                ? { ...i, quantity: i.quantity + validatedQty }
                : i
              )
            };
          }
          return { items: [...state.items, { ...item, quantity: validatedQty }] };
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(i => i.productId !== productId)
        }));
      },
      updateQuantity: (productId, quantity) => {
        const validatedQty = Math.max(12, Math.ceil(quantity / 12) * 12);
        set((state) => ({
          items: state.items.map(i => 
            i.productId === productId ? { ...i, quantity: validatedQty } : i
          )
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      }
    }),
    {
      name: 'glam-cart-storage',
    }
  )
);
