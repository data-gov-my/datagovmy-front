import { NextRequest, NextResponse } from "next/server";

// Triggers on relevant pages. Authentication to be removed at launch
export const config = {
  matcher: ["/", "/data-catalogue/:path*"],
};

export async function middleware(request: NextRequest) {
  let response: NextResponse;
  const basicAuth = request.headers.get("authorization");
  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, password] = atob(authValue).split(":");
    if (user === "admin" && password === process.env.AUTH_TOKEN) {
      response = NextResponse.next();
      return response;
    }
  }
  return new NextResponse("Auth required", {
    status: 401,
    headers: { "WWW-Authenticate": `Basic realm="Secure Area"` },
  });
}
