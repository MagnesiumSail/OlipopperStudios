// === FILE: src/middleware.ts ===
// This file defines middleware for Next.js that checks if a user is an admin before allowing access
// and now also enforces that users must be logged in to access /checkout and /api/checkout.

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Extract the session token from cookies.
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // ...existing logic above this...

  // --- route flags -----------------------------------------------------------
  // check for the path to see if it starts with /admin
  const pathname = req.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");

  // added: protect checkout UI + API
  const isCheckoutRoute =
    pathname.startsWith("/checkout") || pathname === "/api/checkout";

  // --- admin guard -----------------------------------------------------------
  if (isAdminRoute) {
    if (!token || !token?.role || token.role !== "admin") {
      // If the user is not an admin, redirect to the home page
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // --- checkout guard --------------------------------------------------------
  // Require login for any checkout access (UI and API)
  if (isCheckoutRoute) {
    if (!token) {
      // added: redirect unauthenticated users to your login page
      // note: you have a custom login at /user/login
      // we preserve the intended destination using ?callbackUrl=
      const loginUrl = new URL("/user/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.href);
      return NextResponse.redirect(loginUrl);
    }
  }

  // default pass-through
  return NextResponse.next();
}

// Tell Next.js which routes should run through this middleware
// ...under matcher config...
export const config = {
  // added: protect /checkout and the /api/checkout endpoint in addition to /admin/*
  matcher: ["/admin/:path*", "/checkout/:path*", "/api/checkout"],
};
