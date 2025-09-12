import { metaRepo } from "@lib/data-catalogue";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

/**
 * API route handler for uploading data catalogues via POST request.
 *
 * Expects a POST request with the following JSON body:
 * - `fileName`: string (required) - The name of the file to upload.
 * - `data`: string (required, base64) - The base64-encoded file data.
 *
 * Returns:
 * - 405 if the request method is not POST.
 * - 401 if the user is not authenticated.
 * - 400 if the request body is invalid.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!(session && session.github.accessToken)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!req.body || !req.body.fileName || !req.body.data) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  const { fileName, data } = req.body;

  await metaRepo.openDataCataloguePR(session.github.accessToken, fileName, data);

  return res.status(204).json(null);
}
