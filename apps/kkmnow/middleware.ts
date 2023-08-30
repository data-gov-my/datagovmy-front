import { NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/edge-config";

// Triggers on relevant pages. Authentication to be removed at launch
export const config = {
  matcher: ["/", "/dashboard/:path*"],
};

export async function middleware(request: NextRequest) {
  const token = await get<string>("ROLLING_TOKEN");
  const response = NextResponse.next();
  response.cookies.set("rolling_token", token || "yikes", { path: "/", maxAge: 60 * 60 });
  return response;
}
