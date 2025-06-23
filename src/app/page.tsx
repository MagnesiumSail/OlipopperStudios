"use client";

import Image from "next/image";
import { useCart } from "@/utils/CartContext";
import { useEffect, useState } from "react";

export default function Home() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => console.error("Failed to fetch products"));
  }, []);

  const [clickedId, setClickedId] = useState<number | null>(null);

  const handleAddToCart = (product: any) => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0]?.url,
    });

    setClickedId(product.id);
    setTimeout(() => setClickedId(null), 200); // reset after animation
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Products</h1>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <li
            key={product.id}
            className="border p-4 rounded shadow flex flex-col"
          >
            {/* Product Image */}
            {product.images?.length > 0 ? (
              <img
                src={product.images[0].url}
                alt={product.images[0].altText || product.name}
                className="w-full h-40 object-cover mb-2"
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}

            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-sm text-gray-600">{product.description}</p>
            <p className="font-bold mb-2">
              ${(product.price / 100).toFixed(2)}
            </p>

            <button
              onClick={() => handleAddToCart(product)}
              className={`mt-auto bg-black text-white py-2 rounded transition-transform duration-200 hover:bg-gray-800
    ${clickedId === product.id ? "scale-105" : "scale-90"}`}
            >
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
