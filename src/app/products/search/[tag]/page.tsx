// === FILE: src/app/products/search/[tag]/page.tsx ===
// This file renders a filtered product archive by tag (e.g., /products/search/dresses)
import { notFound } from "next/navigation";
export const dynamic = 'force-dynamic';

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

// app/products/search/[tag]/page.tsx
export const revalidate = 0; // or: export const dynamic = 'force-dynamic';

type Props = { params: { tag: string } };

export default async function ProductTagPage({ params }: Props) {
  console.log("Rendering tag page for a tag!");
  const tag = decodeURIComponent(params.tag).trim().toLowerCase();
  
  // Relative URL ensures auth/cookies/headers are forwarded by Next
  const url = `/api/products?tag=${encodeURIComponent(tag)}`;
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    // Log once without consuming the original response
    const body = await res.clone().text().catch(() => '');
    console.log('SSR_FETCH_ERROR', res.status, body.slice(0, 400));
    // Choose: render empty state OR notFound()
    return <div className="p-8 text-center">No products for “{tag}”.</div>;
  }

  const products: Product[] = await res.json();

  return (
    <div className="w-full flex justify-center bg-[#f9f7f8] pt-32 min-h-screen">
      <div className="w-[90vw] max-w-[1800px]">
        <h1 className="text-3xl font-light font-sans tracking-tight mb-10 text-center text-gray-900">
          {`Products tagged: ${tag.charAt(0).toUpperCase() + tag.slice(1)}`}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product) => (
            <a key={product.id} href={`/products/${product.id}`} className="group bg-white rounded-2xl shadow-md border border-gray-100 p-5 flex flex-col h-full transition-all hover:shadow-xl hover:-translate-y-2 focus:ring-2 ring-black/10" style={{ textDecoration: 'none' }}>
              <div className="aspect-[4/5] w-full mb-4 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                {product.images?.[0]?.url ? (
                  <img src={product.images[0].url} alt={product.images[0].altText || product.name} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">No Image</div>
                )}
              </div>
              <div className="flex-1 flex flex-col">
                <h2 className="font-sans font-light text-xl tracking-wide text-gray-900 mb-1 group-hover:underline">{product.name}</h2>
                <p className="text-md font-light text-gray-700 mb-2">${(product.price / 100).toFixed(2)}</p>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{product.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
