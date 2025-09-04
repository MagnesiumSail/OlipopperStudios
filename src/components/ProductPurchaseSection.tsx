// === FILE: src/components/ProductPurchaseSection.tsx ===

"use client";

import { useState } from "react";
import AddToCartButton from "@/components/addToCartButton";

export default function ProductAddToCartSection({ product }: { product: any }) {
  const [selectedSize, setSelectedSize] = useState("");
  const hasSizes =
    Array.isArray(product.sizes) &&
    product.sizes.length > 0 &&
    !product.isPattern;

  return (
    <>
      {/* Size picker only if needed */}
      {hasSizes && (
        <div className="mb-2">
          <label className="block font-medium mb-1">Select Size</label>
          <select
            className="border rounded w-full p-2"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            required
          >
            <option value="">Choose a size...</option>
            {product.sizes.map((size: string) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}
      <AddToCartButton
        product={product}
        size={hasSizes ? selectedSize : undefined}
        disabled={hasSizes && !selectedSize}
      />
    </>
  );
}
