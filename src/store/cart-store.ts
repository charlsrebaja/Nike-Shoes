// src/store/cart-store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  color: string;
}

interface CartResponse {
  id: string;
  userId: string;
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    size: string;
    color: string;
    product: {
      id: string;
      name: string;
      price: string | number;
      images: string[];
    };
  }>;
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  userId: string | null;

  // Actions
  setUser: (userId: string | null) => void;
  fetchCart: () => Promise<void>;
  addItem: (
    productId: string,
    quantity: number,
    size: string,
    color: string
  ) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotal: () => number;
  getItemCount: () => number;
}

// Fallback store for non-authenticated users
const fallbackStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,
      userId: null,

      setUser: (userId) => set({ userId }),

      fetchCart: async () => {
        // No-op for fallback store
      },

      addItem: async (productId, quantity, size, color) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(
          (i) =>
            i.productId === productId && i.size === size && i.color === color
        );

        if (existingItemIndex !== -1) {
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += quantity;
          set({ items: updatedItems });
        } else {
          // For fallback store, we need to create a temporary item
          // In a real app, you'd fetch product details from API
          const newItem: CartItem = {
            id: `temp-${Date.now()}`,
            productId,
            name: "Product", // This would be fetched from API
            price: 0, // This would be fetched from API
            image: "", // This would be fetched from API
            quantity,
            size,
            color,
          };
          set({ items: [...items, newItem] });
        }
      },

      updateQuantity: async (itemId, quantity) => {
        const { items } = get();
        if (quantity === 0) {
          set({ items: items.filter((item) => item.id !== itemId) });
        } else {
          const updatedItems = items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          );
          set({ items: updatedItems });
        }
      },

      removeItem: async (itemId) => {
        const { items } = get();
        set({ items: items.filter((item) => item.id !== itemId) });
      },

      clearCart: async () => {
        set({ items: [] });
      },

      getTotal: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "nike-shop-cart-fallback",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Main cart store that syncs with database
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,
      userId: null,

      setUser: (userId) => {
        set({ userId });
        if (userId) {
          // When user logs in, fetch their cart from database
          get().fetchCart();
        } else {
          // When user logs out, clear cart
          set({ items: [] });
        }
      },

      fetchCart: async () => {
        const { userId } = get();
        if (!userId) return;

        set({ isLoading: true, error: null });

        try {
          const response = await fetch("/api/cart");
          if (!response.ok) {
            throw new Error("Failed to fetch cart");
          }

          const cart: CartResponse = await response.json();

          // Transform database items to CartItem format
          const items: CartItem[] = cart.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            name: item.product.name,
            price:
              typeof item.product.price === "string"
                ? parseFloat(item.product.price)
                : item.product.price,
            image: item.product.images[0] || "",
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          }));

          set({ items, isLoading: false });
        } catch (error) {
          console.error("Error fetching cart:", error);
          set({
            error:
              error instanceof Error ? error.message : "Failed to fetch cart",
            isLoading: false,
          });
        }
      },

      addItem: async (productId, quantity, size, color) => {
        const { userId } = get();
        if (!userId) {
          // Use fallback store for non-authenticated users
          await fallbackStore
            .getState()
            .addItem(productId, quantity, size, color);
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await fetch("/api/cart", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ productId, quantity, size, color }),
          });

          if (!response.ok) {
            throw new Error("Failed to add item to cart");
          }

          const newItem = await response.json();

          // Transform to CartItem format
          const cartItem: CartItem = {
            id: newItem.id,
            productId: newItem.productId,
            name: newItem.product.name,
            price: parseFloat(newItem.product.price.toString()),
            image: newItem.product.images[0] || "",
            quantity: newItem.quantity,
            size: newItem.size,
            color: newItem.color,
          };

          const { items } = get();
          const existingItemIndex = items.findIndex(
            (i) =>
              i.productId === productId && i.size === size && i.color === color
          );

          if (existingItemIndex !== -1) {
            const updatedItems = [...items];
            updatedItems[existingItemIndex] = cartItem;
            set({ items: updatedItems });
          } else {
            set({ items: [...items, cartItem] });
          }

          set({ isLoading: false });
        } catch (error) {
          console.error("Error adding item to cart:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to add item to cart",
            isLoading: false,
          });
        }
      },

      updateQuantity: async (itemId, quantity) => {
        const { userId } = get();
        if (!userId) {
          await fallbackStore.getState().updateQuantity(itemId, quantity);
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/cart/${itemId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ quantity }),
          });

          if (!response.ok) {
            throw new Error("Failed to update cart item");
          }

          if (quantity === 0) {
            const { items } = get();
            set({
              items: items.filter((item) => item.id !== itemId),
              isLoading: false,
            });
          } else {
            const updatedItem = await response.json();

            // Transform to CartItem format
            const cartItem: CartItem = {
              id: updatedItem.id,
              productId: updatedItem.productId,
              name: updatedItem.product.name,
              price: parseFloat(updatedItem.product.price.toString()),
              image: updatedItem.product.images[0] || "",
              quantity: updatedItem.quantity,
              size: updatedItem.size,
              color: updatedItem.color,
            };

            const { items } = get();
            const updatedItems = items.map((item) =>
              item.id === itemId ? cartItem : item
            );
            set({ items: updatedItems, isLoading: false });
          }
        } catch (error) {
          console.error("Error updating cart item:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to update cart item",
            isLoading: false,
          });
        }
      },

      removeItem: async (itemId) => {
        const { userId } = get();
        if (!userId) {
          await fallbackStore.getState().removeItem(itemId);
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/cart/${itemId}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error("Failed to remove item from cart");
          }

          const { items } = get();
          set({
            items: items.filter((item) => item.id !== itemId),
            isLoading: false,
          });
        } catch (error) {
          console.error("Error removing cart item:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to remove item from cart",
            isLoading: false,
          });
        }
      },

      clearCart: async () => {
        const { userId } = get();
        if (!userId) {
          await fallbackStore.getState().clearCart();
          return;
        }

        set({ items: [] });
        // Note: In a real app, you might want to clear the cart in the database too
      },

      getTotal: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "nike-shop-cart",
      storage: createJSONStorage(() => localStorage),
      // Only persist userId and basic state, not the items (they come from DB)
      partialize: (state) => ({
        userId: state.userId,
        items: [], // Don't persist items, they should come from DB
      }),
    }
  )
);
