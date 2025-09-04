// === FILE: src/components/ProductPurchaseSection.tsx ===
"use client";

import { useState } from "react";
import AddToCartButton from "@/components/addToCartButton";

// Add `purchasingPaused` as an optional prop
export default function ProductAddToCartSection({
  product,
  purchasingPaused = false,
}: {
  product: any;
  purchasingPaused?: boolean;
}) {
  const [selectedSize, setSelectedSize] = useState("");

  // sizes only when not a pattern
  const hasSizes =
    Array.isArray(product.sizes) &&
    product.sizes.length > 0 &&
    !product.isPattern;

  // single place to decide if the action should be disabled
  const disabled = purchasingPaused || (hasSizes && !selectedSize);

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
            disabled={purchasingPaused}
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
        disabled={disabled}
      />
    </>
  );
}
