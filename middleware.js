import { NextResponse } from "next/server";

export function middleware(request) {
  if (request.url !== request.url.toLowerCase()) {
    return NextResponse.redirect(request.url.toLowerCase(), 301);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|static|_next|favicon.ico).*)"],
};
