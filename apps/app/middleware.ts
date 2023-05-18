import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// Triggers on relevant pages. Middleware to be removed on launch
export const config = {
  matcher: ["/", "/dashboard/:path*", "/data-catalogue/:path*"],
};

export function middleware(request: NextRequest) {
  // If development, proceed as usual
  if (process.env.NEXT_PUBLIC_APP_ENV === "development")
    return NextResponse.rewrite(request.nextUrl);

  const auth_cookie = request.cookies.get("auth");
  if (!auth_cookie || auth_cookie.value !== process.env.AUTH_TOKEN)
    request.nextUrl.pathname = "/login";

  // Rewrite to URL
  return NextResponse.rewrite(request.nextUrl);
}
