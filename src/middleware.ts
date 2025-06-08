import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });

    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');

    if (isAdminRoute && token?.role !== 'admin') {
        // If the user is not an admin, redirect to the home page
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"], 
};