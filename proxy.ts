/**
 * Proxy — runs before any route renders.
 *
 * Next.js 16 renamed the `middleware` file convention to `proxy`; the file
 * exports a single function, either as a default export or named `proxy`.
 * `next-intl` still ships its half of this as a middleware factory, hence the
 * import name below.
 */
import createIntlMiddleware from "next-intl/middleware";
import { auth } from "@/lib/auth";
import { routing } from "@/i18n/routing";
import { NextResponse } from "next/server";

const intlMiddleware = createIntlMiddleware(routing);

const protectedRoutes = ["/admin"];

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;

  // 1. Check if the route requires auth
  const isProtected = protectedRoutes.some((route) => pathname.includes(route));

  if (isProtected && !req.auth) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isProtected && req.auth && !req.auth.user.is_admin) {
    return NextResponse.redirect(new URL("/en", req.url));
  }

  // 2. Admin routes bypass i18n — they live outside [locale]
  if (isProtected) {
    return NextResponse.next();
  }

  // 3. Handle i18n routing for all other requests
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    "/",
    "/(en|ar)/:path*",
    "/admin/:path*",
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
