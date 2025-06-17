// src/app/admin/components/ProductTable.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

// Type for a single product entry (matching your Prisma schema)
type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  isPattern: boolean;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updateAt: string;
};

export default function ProductTable() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch product data on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/admin/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle product deletion
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");

      // Remove from local state
      setProducts((prev) => prev.filter((p) => p.id !== id));
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
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Price</th>
            <th className="px-4 py-2 border">Active</th>
            <th className="px-4 py-2 border">Pattern</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="text-sm hover:bg-gray-50">
              <td className="px-4 py-2 border">{product.id}</td>
              <td className="px-4 py-2 border">
                <input
                  className="w-full border p-1 text-sm"
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
                  className="w-full border p-1 text-sm"
                  value={(product.price / 100).toFixed(2)} // Assuming price is in cents
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
                  className="w-full border p-1 text-sm"
                  value={product.isActive ? "Yes" : "No"}
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
                  className="w-full border p-1 text-sm"
                  value={product.isPattern ? "Yes" : "No"}
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
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch(
                        `/api/admin/products/${product.id}`,
                        {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(product),
                        }
                      );
                      if (!res.ok) throw new Error("Failed to save changes");
                      alert("Product updated!");
                    } catch (err: any) {
                      alert(err.message);
                    }
                  }}
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
