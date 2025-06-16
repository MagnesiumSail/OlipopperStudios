// src/components/SessionDebug.tsx
'use client';

import { useSession } from 'next-auth/react';

export default function SessionDebug() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p className="text-gray-500">Loading session…</p>;
  if (!session) return <p className="text-red-500">Not logged in</p>;

  return (
    <div className="text-green-600">
      Logged in as: <strong>{session.user.name || session.user.email}</strong>
      <br />
      ID: <code>{session.user.id}</code>
      <br />
      Role: <code>{session.user.role}</code>
    </div>
  );
}
