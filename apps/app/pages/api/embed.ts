import { AxiosResponse } from "axios";
import { get } from "datagovmy-ui/api";
import { SHORT_LANG } from "datagovmy-ui/constants";
import { DCFilter, DCVariable } from "datagovmy-ui/data-catalogue";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * GET endpoint for embed preview
 * @param req Request
 * @param res Response
 * @returns {RevalidateData} Result
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const { id, lang, ...query } = req.query;
    const { data } = (await get(`/data-catalogue2/${id}`, {
      language: SHORT_LANG[lang as keyof typeof SHORT_LANG],
      ...query,
    })) as AxiosResponse<DCVariable>;

    return res
      .setHeader("Cache-Control", "public, s-maxage=21600, stale-while-revalidate=21600") // 30 min
      .json({
        params: {
          id: id ?? null,
        },
        options: data.dropdown.filter((item: DCFilter) => item.name !== "date_slider") ?? null,
      });
  } catch (err: any) {
    return res.status(400).json({ error: "Bad request", authorized: false });
  }
}
