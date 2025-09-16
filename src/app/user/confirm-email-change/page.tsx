// src/app/user/confirm-email-change/page.tsx
"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ConfirmEmailChangePage() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">Email change</h1>
        <p className="text-sm">Confirming…</p>
      </div>
    }>
      <ConfirmInner />
    </Suspense>
  );
}

function ConfirmInner() {
  const params = useSearchParams();              // now inside Suspense
  const token = params.get("token") || "";
  const [msg, setMsg] = useState("Confirming…");

  useEffect(() => {
    const go = async () => {
      if (!token) { setMsg("Invalid link"); return; }
      const res = await fetch("/api/auth/change-email/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (res.ok) {
        setMsg("Email updated. Please sign in with your new email.");
        setTimeout(() => { window.location.href = "/user/login"; }, 1200);
      } else {
        const data = await res.json().catch(() => ({}));
        setMsg(data.error || "Invalid or expired link");
      }
    };
    go();
  }, [token]);

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Email change</h1>
      <p className="text-sm">{msg}</p>
    </div>
  );
}
