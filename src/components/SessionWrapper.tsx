// === FILE: src/components/SessionWrapper.tsx ===
// This file defines a wrapper component for Next.js that provides session management using next-auth.
'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

export default function SessionWrapper({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
