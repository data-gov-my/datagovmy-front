import { NextRequest, NextResponse } from "next/server";
import { addBasePath } from "next/dist/client/add-base-path";
import { addLocale } from "next/dist/client/add-locale";
import { hasBasePath } from "next/dist/client/has-base-path";
import { removeBasePath } from "next/dist/client/remove-base-path";
import { removeLocale } from "next/dist/client/remove-locale";
import { get } from "@vercel/edge-config";

// Triggers on relevant pages. Authorization to remove at launch
export const config = {
  matcher: ["/", "/((?!_next/static|_next/image|favicon.ico|.png).*)"],
};

export const middleware = async (request: NextRequest) => {
  const token = await get<string>("ROLLING_TOKEN");

  // Development / Production
  if (["development", "production"].includes(process.env.NEXT_PUBLIC_APP_ENV))
    return _locale(request, token || "missing token");

  // Staging
  const basicAuth = request.headers.get("authorization");
  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, password] = atob(authValue).split(":");
    if (user === "admin" && password === process.env.AUTH_TOKEN)
      return _locale(request, token || "missing token");
  }
  return new NextResponse("Auth required", {
    status: 401,
    headers: { "WWW-Authenticate": `Basic realm="Secure Area"` },
  });
};

// Bug: withLocales (nextra) does not seem work. Cannot set cookies. Modified from source code
// [https://github.com/shuding/nextra/blob/main/packages/nextra/src/locales.ts]
const _locale = (request: NextRequest, token: string) => {
  const { nextUrl } = request;

  if (/\/_meta(\.[a-z]{2}-[A-Z]{2})?$/.test(nextUrl.pathname)) {
    const url = nextUrl.clone();
    url.pathname = `/404`;
    return NextResponse.rewrite(url);
  }

  const shouldHandleLocale =
    !/^\/(api|_next)\//.test(nextUrl.pathname) &&
    !/\.(jpe?g|svg|png|webmanifest|xml|ico|txt|mp4)$/.test(nextUrl.pathname) &&
    nextUrl.locale !== "" &&
    // not Server-Side Error page
    nextUrl.pathname !== "/500";

  if (!shouldHandleLocale) return;

  // The locale code prefixed in the current URL, which can be empty.
  const locale = nextUrl.locale === nextUrl.defaultLocale ? "" : nextUrl.locale;

  // pathname for default locale doesn't contain basePath and locale segment
  nextUrl.pathname = hasBasePath(nextUrl.pathname)
    ? removeLocale(removeBasePath(nextUrl.pathname), nextUrl.locale)
    : nextUrl.pathname;

  let finalLocale;
  let response: NextResponse;

  if (locale) {
    // If a locale is explicitly set, we don't do any modifications.
    finalLocale = locale;
  } else {
    // If there is a locale cookie, we try to use it. If it doesn't exist, or
    // it's invalid, `nextUrl.locale` will be automatically figured out by Next
    // via the `accept-languages` header.
    const clientLocale = request.cookies.get("NEXT_LOCALE")?.value; //getCookie(request.cookies, "NEXT_LOCALE");
    if (clientLocale) {
      try {
        nextUrl.locale = clientLocale;
      } catch {
        // The locale from the cookie isn't valid.
        // https://github.com/vercel/next.js/blob/e5dee17f776dcc79ebb269f7b7341fa6e2b6c3f1/packages/next/server/web/next-url.ts#L122-L129
      }
    }
    finalLocale = nextUrl.locale;

    // Now we want to display the locale. If it's not the default one, we have
    // to prefix the URL with that locale since it's missing. Only the default
    // locale can be missing from there for consistency.
    if (finalLocale !== nextUrl.defaultLocale) {
      const url = addBasePath(
        addLocale(`${nextUrl.pathname}${nextUrl.search}`, finalLocale, nextUrl.defaultLocale)
      );
      response = NextResponse.redirect(new URL(url, request.url));
      response.cookies.set("rolling_token", token);
      return response;
    }
  }
  let pathname = nextUrl.pathname || "/";
  if (pathname === "/") pathname += "index";
  else if (pathname.endsWith("/")) pathname = pathname.slice(0, -1);

  // If we are not showing the correct localed page, rewrite the current request.
  if (!pathname.endsWith("." + finalLocale)) {
    const url = addBasePath(
      addLocale(`${pathname}.${finalLocale}${nextUrl.search}`, finalLocale, nextUrl.defaultLocale)
    );
    response = NextResponse.rewrite(new URL(url, request.url));
    response.cookies.set("rolling_token", token);
    return response;
  }
};
