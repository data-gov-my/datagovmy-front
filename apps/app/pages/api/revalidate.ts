import type { NextApiRequest, NextApiResponse } from "next";
import { static_routes } from "@lib/routes";
import { STATES } from "@lib/constants";

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

    await Promise.all(
      routes.map(async route =>
        validate(route).then(valid_route => rebuild(res, valid_route, routes))
      )
    );

    return res.json({ message: "Revalidation successful", revalidated: routes });
  } catch (err: any) {
    return res
      .status(400)
      .json({ error: "Revalidation failed", message: err.message, revalidated: [] });
  }
}

// Checks if route exists. Routes only for static pages
const validate = (route: string): Promise<string> =>
  new Promise(resolve => {
    if (static_routes.includes(route)) resolve(route);
    else throw new Error(`Route does not exist or is not a static page. Route: ${route}`);
  });

// Rebuilds the relevant page(s).
const rebuild = async (res: NextApiResponse, route: string, routes: string[]) =>
  new Promise(async resolve => {
    switch (route) {
      // For routes with dynamic /[state] pages
      case "/dashboard/covid-19":
      case "/dashboard/covid-vaccination":
      case "/dashboard/peka-b40":
      case "/dashboard/organ-donation":
      case "/dashboard/blood-donation":
      case "/dashboard/crime":
      case "/ms-MY/dashboard/covid-19":
      case "/ms-MY/dashboard/covid-vaccination":
      case "/ms-MY/dashboard/peka-b40":
      case "/ms-MY/dashboard/organ-donation":
      case "/ms-MY/dashboard/blood-donation":
      case "/ms-MY/dashboard/crime":
        await res.revalidate(route);
        const result = revalidateWithStates(res, route);
        routes.push.apply(routes, result);
        resolve(true);
        break;

      // Simple route
      default:
        await res.revalidate(route);
        resolve(true);
        break;
    }
  });

const revalidateWithStates = (res: NextApiResponse, route: string, except?: string[]): string[] => {
  let states = except ? STATES.filter(item => !except?.includes(item.key)) : STATES;
  states.forEach(async state => await res.revalidate(route.concat("/", state.key)));
  return states.map(({ key }) => route.concat("/", key));
};
