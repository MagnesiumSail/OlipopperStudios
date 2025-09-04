"use client";

import { useState } from "react";

export default function ChangeEmailForm() {
  const [currentPassword, setPwd] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-email/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newEmail }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to start email change");
      }
      setMsg("Check your new email for a confirmation link.");
      setPwd("");
    } catch (err: any) {
      setMsg(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl shadow p-5">
      <h2 className="text-lg font-semibold mb-3">Change email</h2>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          type="email"
          className="border rounded px-3 py-2"
          placeholder="New email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <input
          type="password"
          className="border rounded px-3 py-2"
          placeholder="Current password (for verification)"
          value={currentPassword}
          onChange={(e) => setPwd(e.target.value)}
          required
          autoComplete="current-password"
        />
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white rounded px-4 py-2 disabled:opacity-50 hover:bg-gray-800"
          >
            {loading ? "Sending…" : "Send confirmation link"}
          </button>
          {msg && <p className="text-sm">{msg}</p>}
        </div>
      </form>
    </div>
  );
}
