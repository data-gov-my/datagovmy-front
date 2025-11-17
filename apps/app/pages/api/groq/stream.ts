import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Example streaming API route for Groq API
 * This endpoint demonstrates how to stream responses from Groq, similar to the existing DataGPT implementation
 *
 * @example POST /api/groq/stream
 * Body: {
 *   model: "mixtral-8x7b-32768",
 *   messages: [{ role: "user", content: "Hello!" }],
 *   stream: true
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
    // Ensure streaming is enabled in the request
    const requestBody = {
      ...req.body,
      stream: true,
    };

    // Forward the streaming request to Groq's API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    // Handle non-200 responses from Groq
    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({
        error: "Groq API error",
        details: errorData,
      });
    }

    // Set headers for streaming response
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Stream the response from Groq to the client
    const reader = response.body?.getReader();
    if (!reader) {
      return res.status(500).json({ error: "Failed to read response stream" });
    }

    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        res.write(chunk);
      }
    } finally {
      reader.releaseLock();
    }

    res.end();
  } catch (error: any) {
    console.error("Error streaming from Groq API:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        error: "Internal server error",
        message: error.message,
      });
    }
  }
}
