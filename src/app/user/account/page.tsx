// === FILE: src/app/user/account/page.tsx ===

'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function UserAccountPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Fetch user's orders after session loads
  useEffect(() => {
    if (status === "authenticated") {
      setLoadingOrders(true);
      fetch("/api/user/orders")
        .then(res => res.json())
        .then(data => setOrders(Array.isArray(data) ? data : []))
        .finally(() => setLoadingOrders(false));
    }
  }, [status]);

  if (status === "loading") return <p>Loading…</p>;
  if (!session) return <p>Please log in to view your account.</p>;

  return (
    <div className="max-w-xl mx-auto mt-40 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Account Details</h1>
      <div className="mb-2">
        <span className="font-semibold">Name: </span>
        {session.user.name || <span className="text-gray-500">N/A</span>}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Email: </span>
        {session.user.email}
      </div>

      <hr className="my-8" />

      <h2 className="text-lg font-semibold mb-2">Order History</h2>
      {loadingOrders ? (
        <p>Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="border rounded p-4 bg-gray-50">
              <div className="mb-1 text-gray-700">
                <span className="font-semibold">Order #</span> {order.id}
                {" · "}
                <span className="font-semibold">Status:</span> {order.status}
                {" · "}
                <span className="font-semibold">Date:</span>{" "}
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "N/A"}
              </div>
              <div className="text-gray-600 text-sm mb-1">
                <span className="font-semibold">Total: </span>
                ${(order.totalPrice / 100).toFixed(2)}
              </div>
              <div>
                <span className="font-semibold">Items: </span>
                {order.orderItems?.map((oi: any) =>
                  oi.product ? (
                    <span key={oi.id} className="mr-2">
                      {oi.product.name} ×{oi.quantity}
                    </span>
                  ) : null
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
