"use client";

import { useState } from "react";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (newPassword !== confirm) {
      setMsg("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setMsg("New password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to change password");
      }
      setMsg("Password updated. You will need to sign in again.");
      setCurrent("");
      setNext("");
      setConfirm("");
      // optional: force re-login after a short delay
      setTimeout(() => { window.location.href = "/user/login"; }, 1200);
    } catch (err: any) {
      setMsg(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl shadow p-5">
      <h2 className="text-lg font-semibold mb-3">Change password</h2>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          type="password"
          className="border rounded px-3 py-2"
          placeholder="Current password"
          value={currentPassword}
          onChange={(e) => setCurrent(e.target.value)}
          required
          autoComplete="current-password"
        />
        <input
          type="password"
          className="border rounded px-3 py-2"
          placeholder="New password (min 8 chars)"
          value={newPassword}
          onChange={(e) => setNext(e.target.value)}
          required
          autoComplete="new-password"
          minLength={8}
        />
        <input
          type="password"
          className="border rounded px-3 py-2"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          autoComplete="new-password"
          minLength={8}
        />
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white rounded px-4 py-2 disabled:opacity-50 hover:bg-gray-800"
          >
            {loading ? "Saving..." : "Update password"}
          </button>
          {msg && <p className="text-sm">{msg}</p>}
        </div>
      </form>
    </div>
  );
}
