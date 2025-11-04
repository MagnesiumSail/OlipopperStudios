// === FILE: src/app/products/[id]/page.tsx ===
// This file displays a single product page with details and an "Add to Cart" button

import { notFound } from "next/navigation";
import ProductPurchaseSection from "@/components/ProductPurchaseSection";
import SizeGuideRender from "@/components/sizeGuideRender";


interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  images: { url: string; altText?: string }[];
  isPattern: boolean;
  isActive: boolean;
  tags: string[];
  sizes?: string[];
}


export default async function ProductSinglePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { params } = props;
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/products/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) return notFound();
  const product = await res.json();
  if (!product) return notFound();

  const flagsRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/public/site-flags`,
    { cache: 'no-store' }
  );
  console.log("NEXT_PUBLIC_BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL);

  const { purchasingPaused } = await flagsRes.json();

  console.log("product.sizeGuide:", product.sizeGuide);


  return (
    <div className="w-full flex justify-center bg-[#f9f7f8] pt-32">
      <div className="w-[50vw] max-w-[1800px] flex flex-col md:flex-row gap-12 py-12 md:py-0 px-2 md:px-0">

        <div className="flex-1 flex flex-col gap-8">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
            {product.images && product.images.length > 0 ? (
              product.images.map(
                (img: { url: string; altText?: string }, i: number) => (
                  <img
                    key={i}
                    src={img.url}
                    alt={img.altText || product.name}
                    className="relative w-full aspect-[4/5] bg-[#f8f8f8] rounded-2xl overflow-hidden shadow-md border mb-4"
                    style={{ background: "#f8f8f8" }}
                  />
                )
              )
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg">
                No Image
              </div>
            )}
          </div>
        </div>


        <div className="w-full md:w-[32vw] max-w-sm md:pl-2 md:pr-4">
          <div className="md:sticky md:top-32 flex flex-col gap-5">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col gap-5">
              <h1 className="font-sans font-light text-3xl tracking-wide mb-1 text-gray-900">
                {product.name}
              </h1>
              <p className="text-2xl font-sans font-light mb-3 text-gray-700">
                ${(product.price / 100).toFixed(2)}
              </p>
              <div className="...">



                <div className="my-4">
                  {product.sizeGuide ? (
                    <SizeGuideRender
                      sizeGuideName={product.sizeGuide.name}
                      tableData={product.sizeGuide.tableData}
                    />
                  ) : null}
                </div>
              </div>
              <p className="mb-2 text-gray-800 font-sans font-light text-base leading-relaxed">
                {product.description}
              </p>
              {product.tags.length > 0 && (
                <div className="mb-2 text-gray-500 font-sans text-sm tracking-wide">
                  <span className="font-semibold text-gray-700">Tags:</span>{" "}
                  {product.tags.join(", ")}
                </div>
              )}
              <ProductPurchaseSection
              product={product}
              purchasingPaused={purchasingPaused}
            />

            {purchasingPaused && (
              <div className="text-sm text-yellow-900 bg-yellow-50 border border-yellow-200 rounded-md p-2">
                Purchasing is temporarily paused. Please check back soon.
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
