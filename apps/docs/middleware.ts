import { NextRequest, NextResponse } from "next/server";
import { locales } from "nextra/locales";

// Triggers on relevant pages. Middleware to be removed on launch
export const config = {
  matcher: ["/", "/((?!_next/static|_next/image|favicon.ico|.png).*)"],
};

export const middleware = (request: NextRequest) => {
  if (process.env.APP_ENV === "development") return locales(request);

  const basicAuth = request.headers.get("authorization");
  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, password] = atob(authValue).split(":");

    if (user === "admin" && password === process.env.AUTHORIZATION_TOKEN) return locales(request);
  }

  return new NextResponse("Auth required", {
    status: 401,
    headers: { "WWW-Authenticate": `Basic realm="Secure Area"` },
  });
};
