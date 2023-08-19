import { NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/edge-config";

// Triggers on relevant pages. Authentication to be removed at launch
export const config = {
  matcher: ["/", "/dashboard/:path*", "/data-catalogue/:path*", "/community", "/helpdesk"],
};

export async function middleware(request: NextRequest) {
  let response: NextResponse;
  // Bug: Middleware interferes with getServerSideProps, by returning empty pageProps [https://github.com/vercel/next.js/issues/47516]
  // Fixed by removing the 'x-middleware-prefetch' header
  const headers = new Headers(request.headers);
  const purpose = headers.get("purpose");
  if (purpose && purpose.match(/prefetch/i)) headers.delete("x-middleware-prefetch"); // empty json bugfix (in the browser headers still show, but here it is gone)

  /**
   * @todo Move the code inside production/staging land after finish development
   */
  const token = await get<string>("ROLLING_TOKEN");

  // If development, proceed as usual
  if (process.env.NEXT_PUBLIC_APP_ENV === "development") {
    response = NextResponse.next({ request: { headers } });
    response.cookies.set("nekot", token || "yikes", { path: "/", maxAge: 60 * 60 });
    return response;
  }

  // Else, production/staging land
  const auth_cookie = request.cookies.get("auth");
  if (!auth_cookie || auth_cookie.value !== process.env.AUTH_TOKEN) {
    request.nextUrl.pathname = "/login";
    response = NextResponse.rewrite(request.nextUrl, { headers });
    response.cookies.set("nekot", token || "yikes", { path: "/", maxAge: 60 * 60 });
    return response;
  }

  // Request authenticated
  response = NextResponse.next({ request: { headers } });
  response.cookies.set("nekot", token || "yikes", { path: "/", maxAge: 60 * 60 });
  return response;
}
