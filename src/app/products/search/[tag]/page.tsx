// === FILE: src/app/products/search/[tag]/page.tsx ===
// This file renders a filtered product archive by tag (e.g., /products/search/dresses)

import { notFound } from "next/navigation";

// Product interface (as before)
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

export default async function ProductTagPage(props: { params: Promise<{ tag: string }> }) {
  const { tag } = await props.params;
  console.log("[PAGE] Tag param from route:", tag);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/products?tag=${encodeURIComponent(tag)}`,
    { cache: "no-store" }
  );

  console.log("[PAGE] API Response status:", res.status);

  if (!res.ok) {
    console.log("[PAGE] API not ok, returning notFound()");
    return notFound();
  }
  const products = await res.json();
  console.log("[PAGE] Products from API:", products);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
    <h1 className="text-2xl font-bold mb-6">Products tagged: {tag}</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {products.map((product: Product) => (
        <div
          key={product.id}
          className="bg-white shadow rounded-lg p-4 flex flex-col"
        >
          {/* Product Image */}
          {product.images?.length > 0 ? (
            <img
              src={product.images[0].url}
              alt={product.images[0].altText || product.name}
              className="w-full h-40 object-cover rounded mb-2"
            />
          ) : (
            <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500 rounded">
              No Image
            </div>
          )}
          <h2 className="text-lg font-semibold">{product.name}</h2>
          <p className="text-sm text-gray-600">{product.description}</p>
          <p className="font-bold mb-2">${(product.price / 100).toFixed(2)}</p>
        </div>
      ))}
    </div>
  </div>
  );
}
