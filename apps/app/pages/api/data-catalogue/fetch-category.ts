import { get } from "datagovmy-ui/api";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const results = await Promise.allSettled([
    get(`${process.env.S3_URL}/metadata/metadata_category_en.json`),
    get(`${process.env.S3_URL}/metadata/metadata_category_ms.json`),
  ]);

  const [categoryEn, categoryMs] = results.map(e => {
    if (e.status === "rejected") return null;
    else return e.value.data;
  });

  return res.status(200).json({
    en: categoryEn,
    ms: categoryMs,
  });
}
