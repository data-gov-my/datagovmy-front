import { NextApiRequest, NextApiResponse } from "next";

type RevalidateData = {
  revalidated: string[];
  message?: string;
  error?: string;
};

/**
 * POST endpoint to revalidate pages from BE activity
 * @param req Request
 * @param res Response
 * @returns {RevalidateData} Result
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RevalidateData | string>
) {
  if (req.headers.authorization !== `Bearer ${process.env.REVALIDATE_TOKEN}`) {
    return res
      .status(401)
      .json({ error: "Unauthorized", message: "Invalid bearer token", revalidated: [] });
  }

  try {
    const { route: _route }: { route: string } = req.body;
    if (!_route) throw new Error("Route(s) missing");

    let routes: string[] = _route.split(",");

    await Promise.all(routes.map(async route => rebuild(res, route, routes)));

    return res.json({ message: "Revalidation successful", revalidated: routes });
  } catch (err: any) {
    return res
      .status(400)
      .json({ error: "Revalidation failed", message: err.message, revalidated: [] });
  }
}
// Rebuilds the relevant page(s).
const rebuild = async (res: NextApiResponse, route: string, routes: string[]) =>
  new Promise(async (resolve, reject) => {
    await res.revalidate(route).catch(e => reject(e));
    resolve(true);
  });
