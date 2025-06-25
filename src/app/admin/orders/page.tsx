"use client";

import { useEffect, useState } from "react";

interface Order {
  id: number;
  product: {
    name: string;
  };
  customerEmail: string;
  customerName?: string;
  quantity: number;
  totalPrice: number;
  status: string;
  isCustom: boolean;
  sessionId?: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/admin/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders…</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Customer Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Product</th>
              <th className="px-4 py-2 border">Customer</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Qty</th>
              <th className="px-4 py-2 border">Total</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Custom</th>
              <th className="px-4 py-2 border">Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{order.product.name}</td>
                <td className="px-4 py-2 border">{order.customerName || "-"}</td>
                <td className="px-4 py-2 border">{order.customerEmail}</td>
                <td className="px-4 py-2 border text-center">{order.quantity}</td>
                <td className="px-4 py-2 border">${(order.totalPrice / 100).toFixed(2)}</td>
                <td className="px-4 py-2 border capitalize">{order.status}</td>
                <td className="px-4 py-2 border text-center">{order.isCustom ? "Yes" : "No"}</td>
                <td className="px-4 py-2 border">{new Date(order.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
