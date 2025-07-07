// === FILE: src/components/AddToCartButton.tsx
// This file defines the AddToCartButton component which allows users to add products to their cart.

"use client";

import { useCart } from "@/utils/CartContext";
import { useState } from "react";

interface AddToCartButtonProps {
  product: {
    id: number;
    name: string;
    price: number;
    images?: { url: string }[];
  };
  className?: string;
}

export default function AddToCartButton({ product, className = "" }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [clicked, setClicked] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0]?.url,
    });

    setClicked(true);
    setTimeout(() => setClicked(false), 200); // for animation if desired
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`bg-black text-white py-2 px-4 rounded transition-transform duration-200 hover:bg-gray-800 ${clicked ? "scale-105" : "scale-95"} ${className}`}
      type="button"
    >
      Add to Cart
    </button>
  );
}
