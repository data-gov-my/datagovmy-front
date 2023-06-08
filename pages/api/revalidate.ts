import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { routes } from "@lib/routes";
import { STATES } from "@lib/constants";

type RevalidateData = {
  revalidated: boolean;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RevalidateData | string>
) {
  if (req.headers.authorization !== `Bearer ${process.env.REVALIDATE_TOKEN}`) {
    return res.status(401).json({ revalidated: false, message: "Invalid bearer token" });
  }

  try {
    const { route }: { route: keyof typeof routes } = req.body;
    if (!route) throw new Error("Route missing");

    switch (route) {
      case "DRUG":
      case "CRIME":
        await res.revalidate(routes[route]);
        await revalidateMany(res, route);
        break;

      default:
        await res.revalidate(routes[route]);

        break;
    }

    return res.json({ revalidated: true, message: "Revalidated: " + routes[route] });
  } catch (err: any) {
    return res.status(500).send(err.message);
  }
}

const revalidateMany = async (
  res: NextApiResponse,
  route: keyof typeof routes,
  except?: string[]
): Promise<void> => {
  STATES.filter(item => !except?.includes(item.key)).forEach(async state => {
    await res.revalidate(routes[route].concat("/", state.key));
  });
};
