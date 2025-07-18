// === FILE: src/app/user/register/page.tsx ===
// This file handles user registration functionality

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();

  // Local state for form inputs and status
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  //form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email.toLowerCase(), name, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Something went wrong");
      setLoading(false);
    } else {
      // Auto-login with credentials after registration!
      const loginRes = await signIn("credentials", {
        redirect: false,
        email: email.toLowerCase(),
        password,
      });

      if (loginRes?.error) {
        setSuccess(true);
        setLoading(false);
        // Show registration success, but login failed
      } else {
        router.push("/user/account"); // or wherever you want to land
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Create Account</h1>

      {/* Show error or success messages */}
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && (
        <p className="text-green-600 mb-2">Account created! Redirecting…</p>
      )}

      {/* Registration form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white rounded px-4 py-2 hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>
      </form>
    </div>
  );
}
