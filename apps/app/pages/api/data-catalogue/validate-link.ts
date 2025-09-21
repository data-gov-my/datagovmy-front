import { NextApiRequest, NextApiResponse } from "next";

interface ValidationResult {
  isValid: boolean;
  error?: string;
  status?: number;
  preview?: string[];
}

/**
 * POST endpoint for validating S3 links
 * @param req Request with url and field type
 * @param res Response with validation result
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<ValidationResult>) {
  if (req.method !== "POST") {
    return res.status(405).json({ isValid: false, error: "Method not allowed" });
  }

  const { url, field } = req.body;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ status: 400, isValid: false, error: "link_required" });
  }

  try {
    // Basic URL validation
    new URL(url);
  } catch {
    return res.status(400).json({ status: 400, isValid: false, error: "not_valid_url" });
  }

  if (field === "link_csv" && !url.toLowerCase().includes(".csv")) {
    return res.status(400).json({ status: 400, isValid: false, error: "invalid_file_format_csv" });
  }
  if (
    (field === "link_parquet" || field === "link_preview") &&
    !url.toLowerCase().includes(".parquet")
  ) {
    return res
      .status(400)
      .json({ status: 400, isValid: false, error: "invalid_file_format_parquet" });
  }

  try {
    // HEAD request to check accessibility
    const headResponse = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    if (!headResponse.ok) {
      return res.status(headResponse.status).json({
        isValid: false,
        error: `failed_to_retrieve`,
        status: headResponse.status,
      });
    }

    // For CSV files, fetch first few rows as preview
    if (field === "link_csv" && url.toLowerCase().includes(".csv")) {
      try {
        const previewResponse = await fetch(url, {
          headers: { Range: "bytes=0-4096" }, // First 4KB
          signal: AbortSignal.timeout(10000),
        });

        if (previewResponse.ok) {
          const text = await previewResponse.text();
          const lines = text.split("\n").filter(line => line.trim());

          if (lines.length > 0) {
            // Return first 10 lines including header
            return res.status(200).json({
              isValid: true,
              status: headResponse.status,
              preview: lines.slice(0, 11),
            });
          } else {
            return res.status(200).json({
              isValid: false,
              error: "CSV file appears to be empty",
            });
          }
        } else {
          // Still valid, just no preview available
          return res.status(200).json({
            isValid: true,
            status: headResponse.status,
          });
        }
      } catch (previewError) {
        // Preview failed but link is accessible
        return res.status(200).json({
          isValid: true,
          status: headResponse.status,
        });
      }
    } else {
      // For non-CSV files, just mark as valid
      return res.status(200).json({
        isValid: true,
        status: headResponse.status,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TimeoutError" || error.name === "AbortError") {
        return res.status(408).json({
          isValid: false,
          error: "Request timed out",
        });
      } else {
        return res.status(502).json({
          isValid: false,
          error: `Network error: ${error.message}`,
        });
      }
    } else {
      return res.status(500).json({
        isValid: false,
        error: "Unknown validation error",
      });
    }
  }
}
