import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authjs.session-token")?.value || request.cookies.get("__Secure-authjs.session-token")?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith("/login");
  const isAdminPage = request.nextUrl.pathname.startsWith("/admin");

  if (!token && !isAuthPage && isAdminPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*"],
};