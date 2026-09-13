"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { MOROCCO_CONFIG } from "./country";

export interface CartItem {
  id: string; // product id
  name: string;
  nameAr?: string;
  slug: string;
  imageUrl: string;
  priceMAD: number;
  quantity: number;
  isRecurring: boolean;
  intervalDays?: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (
    product: {
      id: string;
      nameFr: string;
      nameAr?: string;
      slug: string;
      imageUrl: string;
      priceMAD: number;
    },
    quantity?: number,
    isRecurring?: boolean,
    intervalDays?: number
  ) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotalMAD: number;
  deliveryFeeMAD: number;
  totalMAD: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("zaya_cart");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse cart", e);
        }
      }
    }
    return [];
  });

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    if (typeof window !== "undefined") {
      localStorage.setItem("zaya_cart", JSON.stringify(newItems));
    }
  };

  const addToCart = (
    product: {
      id: string;
      nameFr: string;
      nameAr?: string;
      slug: string;
      imageUrl: string;
      priceMAD: number;
    },
    quantity = 1,
    isRecurring = false,
    intervalDays = 30
  ) => {
    // 5% discount for recurring subscriptions
    const effectivePrice = isRecurring ? Number((product.priceMAD * 0.95).toFixed(2)) : product.priceMAD;

    const existingIndex = items.findIndex((i) => i.id === product.id && i.isRecurring === isRecurring);

    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = items.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      updated = [
        ...items,
        {
          id: product.id,
          name: product.nameFr,
          nameAr: product.nameAr,
          slug: product.slug,
          imageUrl: product.imageUrl,
          priceMAD: effectivePrice,
          quantity,
          isRecurring,
          intervalDays: isRecurring ? intervalDays : undefined,
        },
      ];
    }
    saveCart(updated);
  };

  const removeFromCart = (productId: string) => {
    const updated = items.filter((i) => i.id !== productId);
    saveCart(updated);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updated = items.map((i) => (i.id === productId ? { ...i, quantity } : i));
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const subtotalMAD = items.reduce((acc, item) => acc + item.priceMAD * item.quantity, 0);
  const deliveryFeeMAD =
    subtotalMAD === 0 ? 0 : subtotalMAD >= MOROCCO_CONFIG.freeDeliveryThreshold ? 0 : MOROCCO_CONFIG.defaultDeliveryFee;
  const totalMAD = subtotalMAD + deliveryFeeMAD;
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotalMAD,
        deliveryFeeMAD,
        totalMAD,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
