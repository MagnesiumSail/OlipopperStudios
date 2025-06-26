// === FILE: src/middleware.ts ===
// This file defines middleware for Next.js that checks if a user is an admin before allowing access

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    // Extract the session token from cookies.
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    //check for the path to see if it starts with /admin
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');

    if (isAdminRoute) {
        if (!token || !token?.role || (token?.role !== 'admin')) {
            // If the user is not an admin, redirect to the home page
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    return NextResponse.next();
}

// Tell Next.js to continue processing the request
export const config = {
    matcher: ["/admin/:path*"],
};