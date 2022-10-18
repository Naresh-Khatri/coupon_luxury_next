// middleware.ts
import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  if (request.url !== request.url.toLowerCase())
    return NextResponse.redirect(request.url.toLowerCase());
  else return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!api|static|_next|favicon.ico).*)"],
};
