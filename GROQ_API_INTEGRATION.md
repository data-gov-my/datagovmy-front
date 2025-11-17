# Groq API Integration Guide

This guide explains where and how to add your Groq API key to this codebase.

## Overview

This monorepo uses environment variables to manage API keys and configuration. The Groq API key can be integrated for server-side or client-side usage depending on your needs.

## Quick Start

### 1. Add the Groq API Key to Environment Variables

#### For the Main App (`apps/app/`)

1. **Create/Update `.env.local` file** in `apps/app/`:
   ```bash
   cd apps/app
   cp .env.example .env.local
   ```

2. **Add your Groq API key**:
   
   For **server-side only** usage (recommended for security):
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

   For **client-side** usage (only if absolutely necessary):
   ```env
   NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
   ```

   > ⚠️ **Security Note**: Use server-side variables (without `NEXT_PUBLIC_` prefix) whenever possible to keep your API key secure. Client-side variables are exposed in the browser.

### 2. Update Type Definitions

Add the Groq API key type to `apps/app/index.d.ts`:

```typescript
declare namespace NodeJS {
  export interface ProcessEnv {
    // ... existing variables ...
    
    // Groq API
    GROQ_API_KEY: string;
    NEXT_PUBLIC_GROQ_API_KEY?: string; // Only if using client-side
  }
}
```

### 3. Update `.env.example` Files

Add placeholders to `apps/app/.env.example`:

```env
# Groq API
GROQ_API_KEY=
NEXT_PUBLIC_GROQ_API_KEY=
```

## Usage Examples

### Server-Side Usage (Recommended)

Create an API route in `apps/app/pages/api/groq/`:

```typescript
// apps/app/pages/api/groq/chat.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const groqApiKey = process.env.GROQ_API_KEY;
  
  if (!groqApiKey) {
    return res.status(500).json({ error: 'Groq API key not configured' });
  }

  // Use Groq API here
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${groqApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req.body),
  });

  const data = await response.json();
  res.status(200).json(data);
}
```

### Client-Side Usage (Use Sparingly)

If you must use the API key on the client side:

```typescript
// In a React component
const groqApiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

// Note: This exposes the key in the browser, so use server routes instead
```

## Integration with Existing AI Features

The codebase already has a DataGPT feature that uses `NEXT_PUBLIC_AI_URL`. You can:

1. **Replace the existing AI backend** with Groq by creating API routes that proxy to Groq
2. **Add Groq as an alternative model** alongside the existing AI service
3. **Create a new feature** that uses Groq independently

### Example: Modify Existing Chat Stream

To integrate Groq with the existing chat feature, you would:

1. Create a new API route at `apps/app/pages/api/groq/stream.ts`
2. Implement streaming responses compatible with Groq's API
3. Update `packages/datagovmy-ui/src/lib/api.ts` to add a Groq-specific stream function, or
4. Modify the existing `stream` function to support Groq endpoints

## Best Practices

1. **Never commit API keys** - They're already in `.gitignore`
2. **Use server-side variables** - Keep API keys secure
3. **Use environment-specific files**:
   - `.env.local` for local development (git-ignored)
   - `.env.development` for development builds
   - `.env.production` for production builds
4. **Validate environment variables** at startup
5. **Use Vercel/deployment platform** environment variable settings for production

## Deployment

When deploying to Vercel or other platforms:

1. Go to your project settings
2. Navigate to Environment Variables
3. Add `GROQ_API_KEY` with your key value
4. Set the appropriate environment (Development, Preview, Production)

## Troubleshooting

**"Groq API key not defined"**
- Ensure you've created `.env.local` file
- Check that the variable name matches exactly
- Restart your development server after adding environment variables

**"Cannot access Groq API from client"**
- Server-side variables (without `NEXT_PUBLIC_`) are only accessible in API routes and server-side code
- Use API routes to proxy requests to Groq from the client

## Additional Resources

- [Next.js Environment Variables Documentation](https://nextjs.org/docs/basic-features/environment-variables)
- [Groq API Documentation](https://console.groq.com/docs)
- [DataGPT Implementation](apps/app/misc/datagpt/) - Existing AI chat feature for reference

## File Locations Summary

- Environment variables: `apps/app/.env.local` (create this)
- Type definitions: `apps/app/index.d.ts`
- Example file: `apps/app/.env.example`
- API routes: `apps/app/pages/api/`
- Existing AI integration: `apps/app/components/Chat/utils.tsx`
