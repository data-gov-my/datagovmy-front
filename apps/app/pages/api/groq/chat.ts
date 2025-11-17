import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Example API route demonstrating how to use the Groq API key
 * This endpoint proxies requests to Groq's API, keeping your API key secure on the server
 *
 * @example POST /api/groq/chat
 * Body: {
 *   model: "mixtral-8x7b-32768",
 *   messages: [{ role: "user", content: "Hello!" }],
 *   temperature: 0.7,
 *   max_tokens: 1024
 * }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Check if Groq API key is configured
  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    return res.status(500).json({
      error: "Groq API key not configured",
      message: "Please add GROQ_API_KEY to your .env.local file",
    });
  }

  try {
    // Forward the request to Groq's API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    // Handle non-200 responses from Groq
    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({
        error: "Groq API error",
        details: errorData,
      });
    }

    // Return the successful response
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error("Error calling Groq API:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
}
