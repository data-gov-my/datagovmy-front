import { NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/edge-config";

// Triggers on relevant pages. Authentication to be removed at launch
export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/data-catalogue/:path*",
    "/community",
    "/helpdesk",
    "/data-request",
    "/community-products",
  ],
};

export async function middleware(request: NextRequest) {
  let response: NextResponse;
  // Bug: Middleware interferes with getServerSideProps, by returning empty pageProps [https://github.com/vercel/next.js/issues/47516]
  // Fixed by removing the 'x-middleware-prefetch' header
  const headers = new Headers(request.headers);
  const purpose = headers.get("purpose");
  if (purpose && purpose.match(/prefetch/i)) headers.delete("x-middleware-prefetch"); // empty json bugfix (in the browser headers still show, but here it is gone)

  // Tolerate the lookup failing. There is no Edge Config connection string in
  // local development, so this turned every matched route into a 500; in
  // production a transient Edge Config outage would do the same. Both now fall
  // through to the "yikes" default the cookie already defines.
  //
  // try/catch rather than .catch(): with no connection string the SDK throws
  // synchronously, so there is no promise to attach a handler to.
  let token: string | undefined;
  try {
    token = await get<string>("ROLLING_TOKEN");
  } catch {
    token = undefined;
  }

  // Development / Production
  if (["development", "production"].includes(process.env.NEXT_PUBLIC_APP_ENV)) {
    response = NextResponse.next({ request: { headers } });
    response.cookies.set("rolling_token", token || "yikes", { path: "/", maxAge: 60 * 60 });
    return response;
  }

  // Staging
  const basicAuth = request.headers.get("authorization");
  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1] ?? "";
    let decoded = "";
    try {
      decoded = atob(authValue);
    } catch {
      decoded = "";
    }
    // Split on the first colon only, so passwords may contain ":"
    const sep = decoded.indexOf(":");
    const user = sep === -1 ? decoded : decoded.slice(0, sep);
    const password = sep === -1 ? "" : decoded.slice(sep + 1);
    if (isValidStagingUser(user, password)) {
      response = NextResponse.next({ request: { headers } });
      response.cookies.set("rolling_token", token || "yikes", { path: "/", maxAge: 60 * 60 });
      return response;
    }
  }
  return new NextResponse("Auth required", {
    status: 401,
    headers: { "WWW-Authenticate": `Basic realm="Secure Area"` },
  });
}

// Staging basic-auth accounts:
// - "admin" with the AUTH_TOKEN env var (original account)
// - extra accounts from AUTH_EXTRA_USERS, formatted "user1:pass1,user2:pass2"
//   (usernames must not contain ":" or ","; passwords must not contain ",")
function isValidStagingUser(user: string, password: string): boolean {
  if (!user || !password) return false;
  const accounts: Array<[string, string | undefined]> = [["admin", process.env.AUTH_TOKEN]];
  for (const entry of (process.env.AUTH_EXTRA_USERS ?? "").split(",")) {
    const sep = entry.indexOf(":");
    if (sep <= 0) continue;
    accounts.push([entry.slice(0, sep).trim(), entry.slice(sep + 1).trim()]);
  }
  return accounts.some(([u, p]) => !!p && u === user && p === password);
}
