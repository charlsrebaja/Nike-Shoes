// src/store/cart-store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  color: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size: string, color: string) => void;
  updateQuantity: (
    id: string,
    size: string,
    color: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(
          (i) =>
            i.id === item.id && i.size === item.size && i.color === item.color
        );

        if (existingItemIndex !== -1) {
          // If item exists, update quantity
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += item.quantity;
          set({ items: updatedItems });
        } else {
          // If item doesn't exist, add it
          set({ items: [...items, item] });
        }
      },

      removeItem: (id, size, color) => {
        const { items } = get();
        set({
          items: items.filter(
            (item) =>
              !(item.id === id && item.size === size && item.color === color)
          ),
        });
      },

      updateQuantity: (id, size, color, quantity) => {
        const { items } = get();
        const updatedItems = items.map((item) =>
          item.id === id && item.size === size && item.color === color
            ? { ...item, quantity }
            : item
        );
        set({ items: updatedItems });
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "nike-shop-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
