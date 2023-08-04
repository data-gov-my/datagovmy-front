import { NextRequest } from "next/server";
import { rewrite, next } from "@vercel/edge";

// Triggers on relevant pages. Middleware to be removed on launch
export const config = {
  matcher: ["/", "/dashboard/:path*", "/data-catalogue/:path*", "/community", "/helpdesk"],
};

export function middleware(request: NextRequest) {
  // Bug: Middleware interferes with getServerSideProps, by returning empty pageProps [https://github.com/vercel/next.js/issues/47516]
  const reqHeaders = new Headers(request.headers);
  const purpose = reqHeaders.get("purpose");
  const isPrefetch = purpose && purpose.match(/prefetch/i);
  if (isPrefetch) reqHeaders.delete("x-middleware-prefetch"); // empty json bugfix (in the browser headers still show, but here it is gone)

  // If development, proceed as usual
  if (process.env.NEXT_PUBLIC_APP_ENV === "development")
    return next({ request: { headers: reqHeaders } });

  const auth_cookie = request.cookies.get("auth");
  if (!auth_cookie || auth_cookie.value !== process.env.AUTH_TOKEN) {
    request.nextUrl.pathname = "/login";
    return rewrite(request.nextUrl, { headers: reqHeaders });
  }

  // Request authenticated
  return next({ request: { headers: reqHeaders } });
}
