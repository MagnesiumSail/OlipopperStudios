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
    <div>
      <h1>Products tagged: {tag}</h1>
      <ul>
        {products.map((product: any) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}
