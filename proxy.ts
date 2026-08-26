import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

const PUBLIC_PATHS = ["/login", "/register"];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
    const hasToken = request.cookies.has(SESSION_COOKIE_NAME);

    if (!isPublicPath && !hasToken) {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
