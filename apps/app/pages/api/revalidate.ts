import type { NextApiRequest, NextApiResponse } from "next";
import { routes as static_routes } from "@lib/routes";
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

    let routes: string[] = _route === "all" ? Object.values(static_routes) : _route.split(",");

    routes.forEach(async (route: string) => validate(res, route));

    return res.json({ message: "Revalidation successful", revalidated: routes });
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: "Revalidation failed", message: err.message, revalidated: [] });
  }
}

const validate = async (res: NextApiResponse, route: string) => {
  switch (route) {
    // For routes with dynamic pages (.../[states])
    case "dashboard/covid-19":
    case "dashboard/covid-vaccination":
    case "dashboard/peka-b40":
    case "dashboard/organ-donation":
    case "dashboard/blood-donation":
    case "dashboard/crime":
      await res.revalidate(route);
      await revalidateWithStates(res, route);
      break;

    // Simple route
    default:
      await res.revalidate(route);
      break;
  }
};

const revalidateWithStates = async (
  res: NextApiResponse,
  route: string,
  except?: string[]
): Promise<void> => {
  let states = except ? STATES.filter(item => !except?.includes(item.key)) : STATES;
  states.forEach(async state => {
    await res.revalidate(route.concat("/", state.key));
  });
};
