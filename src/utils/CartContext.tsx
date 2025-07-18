// === FILE: src/utils/CartContext.tsx ===
// This file defines a context for managing the shopping cart in a Next.js application.

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export interface CartItem {
  productId: number;
  name: string;
  price: number; // in cents for convenience
  quantity: number;
  image?: string;
  size?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number, size?: string) => void;
  clearCart: () => void;
  updateQuantity: (productId: number, quantity: number, size?: string) => void;
  getTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = "olipopper_cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on first render
  useEffect(() => {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch {
        localStorage.removeItem(CART_KEY);
      }
    }
  }, []);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (p) => p.productId === item.productId && p.size === item.size
      );
      if (existing) {
        return prev.map((p) =>
          p.productId === item.productId && p.size === item.size
            ? { ...p, quantity: p.quantity + item.quantity }
            : p
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (productId: number, size?: string) => {
    setCart((prev) =>
      prev.filter(
        (p) => !(p.productId === productId && (size ? p.size === size : true))
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateQuantity = (
    productId: number,
    quantity: number,
    size?: string
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
    } else {
      setCart((prev) =>
        prev.map((p) =>
          p.productId === productId && p.size === size ? { ...p, quantity } : p
        )
      );
    }
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook for consuming cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
