import { NextResponse } from "next/server";
import { createClient } from "@vercel/edge-config";

export const config = {
  runtime: "edge",
};

export const getRollingToken = async () => {
  const edge = createClient(process.env.NEXT_PUBLIC_EDGE_CONFIG);
  const rollingToken = await edge.get<string>("ROLLING_TOKEN");

  if (!Boolean(rollingToken)) {
    return false;
  }
  return NextResponse.json({
    token: rollingToken,
  });
};
