import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.JWT_SECRET });

    // console.log(token);

    const { pathname } = req.nextUrl;
    // console.log(pathname);

    // Allow the request if its true
    // 1) If token exists
    // 2) Its a login request
    if (pathname.includes('/api/auth') || token || pathname === '/login') {
        // console.log("allow");
        return NextResponse.next();
        
    }

    if (pathname.startsWith("/_next/")) {
        // console.log("bypass");
        return NextResponse.next();
    }

    if (!token && pathname !== '/login') {
        // console.log("disallow");
        return NextResponse.redirect(new URL('/login', req.url));
    }
}