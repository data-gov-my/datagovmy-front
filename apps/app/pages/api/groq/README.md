# Groq API Example Routes

This directory contains example API routes demonstrating how to integrate Groq API into the application.

## Files

- **`chat.ts`** - Standard chat completion endpoint (non-streaming)
- **`stream.ts`** - Streaming chat completion endpoint

## Setup

Before using these routes, ensure you have configured your Groq API key:

1. Add to `apps/app/.env.local`:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

2. The environment variable is automatically typed in `apps/app/index.d.ts`

## Usage

### Standard Chat (`/api/groq/chat`)

```bash
curl -X POST http://localhost:3000/api/groq/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "mixtral-8x7b-32768",
    "messages": [
      {"role": "user", "content": "Explain quantum computing in simple terms"}
    ],
    "temperature": 0.7,
    "max_tokens": 1024
  }'
```

### Streaming Chat (`/api/groq/stream`)

```bash
curl -X POST http://localhost:3000/api/groq/stream \
  -H "Content-Type: application/json" \
  -d '{
    "model": "mixtral-8x7b-32768",
    "messages": [
      {"role": "user", "content": "Write a short story"}
    ]
  }'
```

## Available Groq Models

- `mixtral-8x7b-32768` - Mixtral 8x7B model with 32k context
- `llama2-70b-4096` - LLaMA 2 70B with 4k context
- `gemma-7b-it` - Google's Gemma 7B instruct-tuned model

For the latest list of models, see [Groq Documentation](https://console.groq.com/docs/models).

## Integration with DataGPT

To use Groq with the existing DataGPT feature:

1. Update the `fetchResponse` function in `apps/app/components/Chat/utils.tsx`
2. Change the endpoint from the current AI service to `/api/groq/stream`
3. Adjust the model parameter to use a Groq model

Example modification:

```typescript
// In apps/app/components/Chat/utils.tsx
const fetchResponse = async (prompt: string) => {
  setData("fetching", true);
  const payload = {
    model: "mixtral-8x7b-32768", // Changed from gpt-3.5-turbo
    messages: session?.chats.filter(chat => chat.content !== t("prompt_error")).slice(-5) || [
      { role: "user", content: prompt },
    ],
    max_tokens: 1000,
    temperature: 0,
  };

  try {
    // Use local API route instead of external service
    const response = await fetch("/api/groq/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    
    // ... rest of streaming logic
  } catch (error) {
    // ... error handling
  }
};
```

## Security Notes

- API keys are stored as server-side environment variables
- Keys are never exposed to the client
- All requests are proxied through Next.js API routes
- Consider adding rate limiting for production use

## Further Reading

- [Groq API Integration Guide](../../../../GROQ_API_INTEGRATION.md) - Complete integration documentation
- [Groq Console](https://console.groq.com) - Manage your API keys
- [Groq Documentation](https://console.groq.com/docs) - Official API documentation
