import { static_routes } from "@lib/routes";
import { STATES } from "datagovmy-ui/constants";
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

    const routes: string[] = _route.split(",");

    await Promise.all(
      routes.map(async route =>
        validate(route)
          .then(valid_route => rebuild(res, valid_route, routes))
          .catch(e => {
            throw new Error(e);
          })
      )
    );

    return res.json({ message: "Revalidation successful", revalidated: routes });
  } catch (err: any) {
    return res
      .status(400)
      .json({ error: "Revalidation failed", message: err.message, revalidated: [] });
  }
}

// Checks if route exists. Routes only valid for static pages
const validate = (route: string): Promise<string> =>
  new Promise((resolve, reject) => {
    if (static_routes.includes(route)) resolve(route);
    else reject(`Route does not exist or is not a static page. Route: ${route}`);
  });

// Rebuilds the relevant page(s).
const rebuild = async (res: NextApiResponse, route: string, routes: string[]) =>
  new Promise(async (resolve, reject) => {
    switch (route) {
      // For routes with dynamic /[state] pages
      case "/dashboard/business-creation-destruction":
      case "/dashboard/drug-addiction":
      case "/dashboard/fire-and-rescue":
      case "/dashboard/jobless-claims":
      case "/ms-MY/dashboard/business-creation-destruction":
      case "/ms-MY/dashboard/drug-addiction":
      case "/ms-MY/dashboard/fire-and-rescue":
      case "/ms-MY/dashboard/jobless-claims":
        await res.revalidate(route);
        const result = revalidateWithStates(res, route);
        routes.push.apply(routes, result);
        resolve(true);
        break;

      // Simple route
      default:
        await res.revalidate(route).catch(e => reject(e));
        resolve(true);
        break;
    }
  });

const revalidateWithStates = (res: NextApiResponse, route: string, except?: string[]): string[] => {
  let states = except ? STATES.filter(item => !except?.includes(item.key)) : STATES;
  states.forEach(
    async state =>
      await res.revalidate(route.concat("/", state.key)).catch(e => {
        throw new Error(e);
      })
  );
  return states.map(({ key }) => route.concat("/", key));
};
