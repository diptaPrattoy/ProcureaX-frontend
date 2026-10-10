import { type NextRequest, NextResponse } from "next/server";

const ACCESS_COOKIE = "procurax_access";

export function proxy(request: NextRequest) {
  if (request.cookies.has(ACCESS_COOKIE)) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/workspace/:path*", "/buyer/:path*", "/supplier/:path*", "/admin/:path*"],
};
