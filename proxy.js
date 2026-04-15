import { NextResponse } from "next/server";

export function proxy(request) {
  const url = request.nextUrl;
  if (url.pathname !== url.pathname.toLowerCase()) {
    const redirectUrl = url.clone();
    redirectUrl.pathname = url.pathname.toLowerCase();
    return NextResponse.redirect(redirectUrl, 301);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|static|_next|favicon.ico).*)"],
};
