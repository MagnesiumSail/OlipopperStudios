// === FILE: src/app/products/[id]/page.tsx ===
// This file displays the details of a specific product.

// === FILE: src/app/products/[id]/page.tsx ===

import { notFound } from "next/navigation";
import AddToCartButton from "@/components/addToCartButton";

// You could fetch via API or directly from Prisma if using a server component
// Here's an example using fetch:

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

export default async function ProductSinglePage({
  params,
}: {
  params: { id: string };
}) {
  // Fetch the product data from your API
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/products/${params.id}`,
    {
      cache: "no-store", // always show latest data
    }
  );

  if (!res.ok) {
    return notFound();
  }

  const product: Product = await res.json();

  if (!product) {
    return notFound();
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0">
          {/* Main product image */}
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0].url}
              alt={product.images[0].altText || product.name}
              className="rounded-lg w-72 h-72 object-cover mb-2"
            />
          ) : (
            <div className="w-72 h-72 bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg">
              No Image
            </div>
          )}

          {/* Thumbnails for additional images */}
          <div className="flex gap-2 mt-2">
            {product.images.slice(1).map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={img.altText || product.name}
                className="w-16 h-16 object-cover rounded border"
              />
            ))}
          </div>
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-lg font-semibold text-gray-700 mb-4">
            ${(product.price / 100).toFixed(2)}
          </p>
          <p className="mb-6 text-gray-800">{product.description}</p>

          {product.tags.length > 0 && (
            <div className="mb-4">
              <span className="font-semibold">Tags: </span>
              {product.tags.join(", ")}
            </div>
          )}
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
