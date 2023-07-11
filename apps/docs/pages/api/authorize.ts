import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

type AuthorizedResponse = {
  authorized: boolean;
  error?: string;
};

/**
 * POST endpoint to authorize visitor during development stage
 * @param req Request
 * @param res Response
 * @returns {RevalidateData} Result
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthorizedResponse | string>
) {
  try {
    const { password } = req.body;
    if (!password || password !== process.env.AUTH_TOKEN) throw new Error("Invalid password");

    return res
      .setHeader("Set-Cookie", serialize("auth", password, { path: "/" }))
      .json({ authorized: true });
  } catch (err: any) {
    return res.status(400).json({ error: "Invalid password", authorized: false });
  }
}
