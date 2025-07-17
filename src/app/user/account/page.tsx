// === FILE: src/app/user/account/page.tsx ===

'use client';

import { useSession } from "next-auth/react";

export default function UserAccountPage() {
  const { data: session, status } = useSession();

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
      <p className="mt-6 text-gray-500 italic">
        (Account features coming soon!)
      </p>
    </div>
  );
}
