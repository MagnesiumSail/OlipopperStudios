// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Use the centralized auth config
const handler = NextAuth(authOptions);

// Export GET and POST handlers for NextAuth API routes
export { handler as GET, handler as POST };
