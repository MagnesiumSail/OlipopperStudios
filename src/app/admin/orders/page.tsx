// === FILE: src/app/admin/orders/page.tsx ===

// This file displays the admin orders page where admins can view and manage customer orders.

"use client";

import { useEffect, useState } from "react";

interface OrderItem {
  id: number;
  product?: {
    name: string;
  };
  quantity: number;
  unitPrice: number;
  size?: string;
}

interface Order {
  id: number;
  customerEmail: string;
  customerName?: string;
  totalPrice: number;
  status: string;
  isCustom: boolean;
  sessionId?: string;
  createdAt: string;
  orderItems: OrderItem[];
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

  const handleStatusChange = async (orderId: number, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return <p>Loading orders…</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Admin: Orders</h1>
      <table className="w-full border-collapse bg-white shadow rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Order #</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Customer</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Items</th>
            <th className="p-3 text-left">Total</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-10 text-gray-500">
                No orders found.
              </td>
            </tr>
          ) : (
            orders.map(order => (
              <tr key={order.id} className="border-b">
                <td className="p-3 font-mono">{order.id}</td>
                <td className="p-3">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "-"}
                </td>
                <td className="p-3">{order.customerName || "-"}</td>
                <td className="p-3">{order.customerEmail}</td>
                <td className="p-3">
                  <ul>
                    {order.orderItems.map(item => (
                      <li key={item.id} className="mb-1">
                        <span className="font-medium">{item.product?.name || "Deleted Product"}</span>
                        {" ×"}
                        <span className="ml-1">{item.quantity}</span>
                        {item.size && (
                          <span className="ml-2 text-xs px-2 py-1 bg-gray-200 rounded font-mono">
                            Size: {item.size}
                          </span>
                        )}
                        <span className="ml-3 text-gray-400 text-xs">
                          (${(item.unitPrice / 100).toFixed(2)} each)
                        </span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="p-3 font-semibold">${(order.totalPrice / 100).toFixed(2)}</td>
                <td className="p-3">
                  <select
                    className="border rounded px-2 py-1"
                    value={order.status}
                    onChange={e => handleStatusChange(order.id, e.target.value)}
                  >
                    {["paid", "in_progress", "in_transit", "delivered", "cancelled"].map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
