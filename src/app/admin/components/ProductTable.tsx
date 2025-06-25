"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface ProductImage {
  id?: number;
  url: string;
  altText?: string;
  order?: number;
}

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  isPattern: boolean;
  isActive: boolean;
  tags: string[];
  sizeGuideId?: number;
  createdAt: string;
  updateAt: string;
  images: ProductImage[];
}

export default function ProductTable() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sizeGuides, setSizeGuides] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await fetch("/api/admin/products");
        if (!productsRes.ok) throw new Error("Failed to fetch products");

        const guidesRes = await fetch("/api/admin/size-guides");
        if (!guidesRes.ok) throw new Error("Failed to fetch size guides");

        const [productsData, guidesData] = await Promise.all([
          productsRes.json(),
          guidesRes.json(),
        ]);

        setProducts(productsData);
        setSizeGuides(guidesData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSave = async (product: Product) => {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error("Failed to save changes");
      alert("Product updated!");
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (status === "loading" || loading) return <p>Loading products…</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="text-left text-sm">
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Price ($)</th>
            <th className="px-4 py-2 border">Active</th>
            <th className="px-4 py-2 border">Pattern</th>
            <th className="px-4 py-2 border">Tags</th>
            <th className="px-4 py-2 border">Size Guide</th>
            <th className="px-4 py-2 border">Images</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="text-sm hover:bg-gray-50">
              <td className="px-4 py-2 border">
                <input
                  className="w-full border p-1"
                  value={product.name}
                  onChange={(e) =>
                    setProducts((prev) =>
                      prev.map((p) =>
                        p.id === product.id ? { ...p, name: e.target.value } : p
                      )
                    )
                  }
                />
              </td>
              <td className="px-4 py-2 border">
                <input
                  type="number"
                  className="w-full border p-1"
                  value={(product.price / 100).toFixed(2)}
                  onChange={(e) =>
                    setProducts((prev) =>
                      prev.map((p) =>
                        p.id === product.id
                          ? {
                              ...p,
                              price: Math.round(parseFloat(e.target.value) * 100),
                            }
                          : p
                      )
                    )
                  }
                />
              </td>
              <td className="px-4 py-2 border text-center">
                <input
                  type="checkbox"
                  checked={product.isActive}
                  onChange={(e) =>
                    setProducts((prev) =>
                      prev.map((p) =>
                        p.id === product.id
                          ? { ...p, isActive: e.target.checked }
                          : p
                      )
                    )
                  }
                />
              </td>
              <td className="px-4 py-2 border text-center">
                <input
                  type="checkbox"
                  checked={product.isPattern}
                  onChange={(e) =>
                    setProducts((prev) =>
                      prev.map((p) =>
                        p.id === product.id
                          ? { ...p, isPattern: e.target.checked }
                          : p
                      )
                    )
                  }
                />
              </td>
              <td className="px-4 py-2 border">
                <input
                  className="w-full border p-1"
                  value={product.tags.join(", ")}
                  onChange={(e) =>
                    setProducts((prev) =>
                      prev.map((p) =>
                        p.id === product.id
                          ? {
                              ...p,
                              tags: e.target.value
                                .split(",")
                                .map((tag) => tag.trim()),
                            }
                          : p
                      )
                    )
                  }
                />
              </td>
              <td className="px-4 py-2 border">
                <select
                  className="w-full border p-1"
                  value={product.sizeGuideId || ""}
                  onChange={(e) =>
                    setProducts((prev) =>
                      prev.map((p) =>
                        p.id === product.id
                          ? {
                              ...p,
                              sizeGuideId:
                                parseInt(e.target.value) || undefined,
                            }
                          : p
                      )
                    )
                  }
                >
                  <option value="">None</option>
                  {sizeGuides.map((guide) => (
                    <option key={guide.id} value={guide.id}>
                      {guide.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-2 border">
                <ul className="space-y-1 max-w-[150px]">
                  {product.images.map((img, i) => (
                    <li key={i} className="text-xs truncate text-blue-600">
                      <a href={img.url} target="_blank" rel="noreferrer">
                        {img.url}
                      </a>
                    </li>
                  ))}
                </ul>
              </td>
              <td className="px-4 py-2 border whitespace-nowrap">
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleSave(product)}
                  className="text-blue-600 hover:underline ml-4"
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
