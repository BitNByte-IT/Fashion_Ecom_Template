"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (product: Product, size: string, color: string, qty?: number) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Computed
  itemCount: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, size, color, qty = 1) => {
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.product.id === product.id &&
              i.selectedSize === size &&
              i.selectedColor === color
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id &&
                i.selectedSize === size &&
                i.selectedColor === color
                  ? { ...i, quantity: i.quantity + qty }
                  : i
              ),
              isOpen: true,
            };
          }
          return {
            items: [
              ...state.items,
              { product, quantity: qty, selectedSize: size, selectedColor: color },
            ],
            isOpen: true,
          };
        });
      },

      removeItem: (productId, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(
                i.product.id === productId &&
                i.selectedSize === size &&
                i.selectedColor === color
              )
          ),
        }));
      },

      updateQuantity: (productId, size, color, qty) => {
        if (qty < 1) {
          get().removeItem(productId, size, color);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId &&
            i.selectedSize === size &&
            i.selectedColor === color
              ? { ...i, quantity: qty }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
