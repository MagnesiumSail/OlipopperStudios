// === FILE: src/app/user/login/page.tsx ===
// This file handles user login functionality using NextAuth

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();

  // Track form input and UI state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Call NextAuth signIn with "credentials" provider
    const res = await signIn("credentials", {
      redirect: false,
      email: email.toLowerCase(),
      password,
    });

    if (res?.error) {
      // Show error from NextAuth response
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      // Redirect to home or admin dashboard
      router.push("/");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Log In</h1>

      {/* Show any login errors */}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      {/* Login form */}
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
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white rounded px-4 py-2 hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-sm mt-3">
          <a href="/user/forgot-password" className="underline text-blue-600">
            Forgot your password?
          </a>
        </p>
      </form>
    </div>
  );
}
