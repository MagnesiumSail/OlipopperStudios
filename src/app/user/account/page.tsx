// === FILE: src/app/user/account/page.tsx ===

"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import ChangePasswordForm from "@/components/ChangePasswordForm";

const IN_PROGRESS_STATUSES = ["paid", "in_progress", "in_transit"];
const HISTORY_STATUSES = ["delivered", "cancelled"];

export default function UserAccountPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      setLoadingOrders(true);
      fetch("/api/user/orders")
        .then((res) => res.json())
        .then((data) => setOrders(Array.isArray(data) ? data : []))
        .finally(() => setLoadingOrders(false));
    }
  }, [status]);

  if (status === "loading") return <p>Loading…</p>;
  if (!session) return <p>Please log in to view your account.</p>;

  // Split orders into "in progress" and "history"
  const inProgress = orders.filter((o) =>
    IN_PROGRESS_STATUSES.includes(o.status)
  );
  const history = orders.filter((o) => HISTORY_STATUSES.includes(o.status));

  async function handleDeleteAccount() {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    )
      return;
    setDeleting(true);
    setDeleteError("");
    const res = await fetch("/api/user", { method: "DELETE" });
    if (res.ok) {
      // Account deleted — sign them out
      await signOut({ callbackUrl: "/" }); // Redirects to homepage after logout
    } else {
      const data = await res.json();
      setDeleteError(data.error || "Failed to delete account.");
      setDeleting(false);
    }
  }

  function OrderList({ orders }: { orders: any[] }) {
    if (!orders.length)
      return <p className="text-gray-500">No orders found.</p>;
    return (
      <div className="space-y-4">
        {orders.map((order) => (
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
              <span className="font-semibold">Total: </span>$
              {(order.totalPrice / 100).toFixed(2)}
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
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-white rounded shadow">
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

      <h2 className="text-lg font-semibold mb-2">In Progress</h2>
      {loadingOrders ? (
        <p>Loading orders…</p>
      ) : (
        <OrderList orders={inProgress} />
      )}

      <hr className="my-8" />

      <h2 className="text-lg font-semibold mb-2">Order History</h2>
      {loadingOrders ? <p>Loading orders…</p> : <OrderList orders={history} />}
      <button
        className="bg-gray-300 text-gray-900 px-4 py-2 rounded mt-8 m-2 hover:bg-gray-400"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        Logout
      </button>
      <div className="mt-8">
        <ChangePasswordForm />
      </div>
      <button
        className="bg-red-600 text-white px-4 py-2 rounded mt-8 hover:bg-red-700 disabled:opacity-50"
        disabled={deleting}
        onClick={handleDeleteAccount}
      >
        {deleting ? "Deleting…" : "Delete Account"}
      </button>
      {deleteError && <p className="text-red-600 mt-2">{deleteError}</p>}
    </div>
  );
}
