// === FILE: src/components/addToCartButton.tsx ===

'use client';

import { useCart } from "@/utils/CartContext";
import { useState } from "react";

export default function AddToCartButton({
  product,
  size,
  disabled,
}: {
  product: any;
  size?: string;
  disabled?: boolean;
}) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    setAdding(true);
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0]?.url || "",
      ...(size && { size }),
    });
    console.log("Added to cart:", {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0]?.url || "",
      ...(size && { size }),
    });
    setAdding(false);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={!!disabled || adding}
      className={`mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-60 transition`}
    >
      {adding ? "Adding..." : "Add to Cart"}
    </button>
  );
}
