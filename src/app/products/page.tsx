// === FILE: src/app/products/page.tsx ===
// This file displays a list of all products in a grid layout

"use client";

import { useCart } from "@/utils/CartContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import AddToCartButton from "@/components/addToCartButton";

// Product type for context
interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  images: { url: string; altText?: string }[];
  isPattern: boolean;
  isActive: boolean;
  tags: string[];
}

export default function ProductsPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => console.error("Failed to fetch products"));
  }, []);

  return (
    // Added: Faint gray bg, nav spacing, wide max width
    <div className="w-full flex justify-center bg-[#f9f7f8] pt-32 min-h-screen">
      <div className="w-[90vw] max-w-[1800px]">
        {/* Added: Modern heading */}
        <h1 className="text-3xl font-light font-sans tracking-tight mb-10 text-center text-gray-900">
          All Products
        </h1>

        {/* Added: Grid layout with lots of space */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product) => (
            // Changed: Elegant, floating card style
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group bg-white rounded-2xl shadow-md border border-gray-100 p-5 flex flex-col h-full transition-all hover:shadow-xl hover:-translate-y-2 focus:ring-2 ring-black/10"
              style={{ textDecoration: "none" }}
            >
              {/* Product Image */}
              <div className="aspect-[4/5] w-full mb-4 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                {product.images?.[0]?.url ? (
                  <img
                    src={product.images[0].url}
                    alt={product.images[0].altText || product.name}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col">
                <h2 className="font-sans font-light text-xl tracking-wide text-gray-900 mb-1 group-hover:underline">
                  {product.name}
                </h2>
                <p className="text-md font-light text-gray-700 mb-2">
                  ${(product.price / 100).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {product.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
