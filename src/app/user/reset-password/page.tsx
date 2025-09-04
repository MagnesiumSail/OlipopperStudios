"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") || "";
  const email = params.get("email") || "";
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd !== confirm) { setMsg("Passwords do not match"); return; }
    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, newPassword: pwd }),
    });
    setLoading(false);
    if (res.ok) {
      setMsg("Password updated. You can log in now.");
      setTimeout(() => router.push("/user/login"), 1000);
    } else {
      const data = await res.json().catch(() => ({}));
      setMsg(data.error || "Invalid or expired link");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Set a new password</h1>
      {!token || !email ? (
        <p className="text-sm text-red-600">Invalid reset link.</p>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="New password (min 8 chars)"
            className="border px-3 py-2 rounded"
            value={pwd}
            onChange={e => setPwd(e.target.value)}
            minLength={8}
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            className="border px-3 py-2 rounded"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            minLength={8}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white rounded px-4 py-2 hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Saving…" : "Reset password"}
          </button>
          {msg && <p className="text-sm">{msg}</p>}
        </form>
      )}
    </div>
  );
}
