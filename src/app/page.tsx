// === FILE: src/app/page.tsx ===
// Home page: shows 3 newest products, then about/info section.

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Product type (can import if you have a shared one)
interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  images: { url: string; altText?: string }[];
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch newest 3 products
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((all) => {
        // Sort by createdAt descending if you want, but for MVP just grab first 3
        setProducts(all.slice(-3).reverse());
      })
      .catch(() => setProducts([]));
  }, []);

  return (
    <div className="w-full flex justify-center bg-[#f9f7f8] pt-32 min-h-screen">
      <div className="w-[90vw] max-w-[1000px]">
        {/* Newest Products */}
        <h1 className="text-3xl font-light font-sans tracking-tight mb-8 text-center text-gray-900">
          New Arrivals
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mb-12">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group bg-white rounded-2xl shadow-md border border-gray-100 p-5 flex flex-col h-full transition-all hover:shadow-xl hover:-translate-y-2 focus:ring-2 ring-black/10"
              style={{ textDecoration: "none" }}
            >
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
              </div>
            </Link>
          ))}
        </div>

        {/* Boring About Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 text-center mx-auto max-w-2xl">
          <h2 className="text-xl font-sans font-light mb-2 text-gray-800">Welcome to Olipopper Studios</h2>
          <p className="text-gray-600 mb-3">
            Every piece in our shop is thoughtfully designed and handmade by Olivia. Explore our new arrivals, browse categories, or request your own custom order. 
          </p>
          <p className="text-gray-600">
            Questions? Want something unique? <Link href="/custom-order" className="text-blue-700 underline">Request a custom garment</Link> or <Link href="/contact" className="text-blue-700 underline">contact us</Link> for more info.
          </p>
        </div>
      </div>
    </div>
  );
}
