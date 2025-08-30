# 🤖 AI-Powered Search Setup

## Overview

The Creator Search app now includes AI-powered natural language search using OpenRouter with GPT-4o-mini model. Users can search using phrases like "Turkish gaming creators with high engagement" instead of manually setting filters.

## Features

✅ **Natural Language Processing**: Convert queries like "Turkish tech creators" into structured filters
✅ **Smart Fallback**: Works even without OpenRouter API key using keyword matching
✅ **Real-time Processing**: Instant translation of queries to database filters
✅ **Cost Effective**: Uses OpenRouter for competitive AI model pricing
✅ **User Friendly**: Provides example queries and shows last search

## Setup Instructions

### 1. Get OpenRouter API Key (Optional but Recommended)

1. Go to [OpenRouter](https://openrouter.ai/keys)
2. Sign up/Login with your account
3. Create a new API key
4. Copy the key (starts with `sk-...`)

### 2. Add Environment Variables

**For Local Development:**
Add to your `.env.local` file:
```env
OPENROUTER_API_KEY=sk-your-openrouter-key-here
```

**For Vercel Deployment:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `OPENROUTER_API_KEY` = `sk-your-openrouter-key-here`
3. Set for Production, Preview, and Development environments

### 3. Without OpenRouter API Key

The system works without an API key using intelligent keyword matching:
- ✅ Platform detection: "Instagram creators" → filters by Instagram
- ✅ Location detection: "Turkish creators" → filters by Turkey  
- ✅ Vertical detection: "gaming influencers" → filters by Gaming
- ✅ Engagement detection: "high engagement" → filters by strong engagement

## Example Queries

**Geographic Searches:**
- "Turkish gaming creators"
- "European fashion influencers" 
- "US tech creators"

**Platform Specific:**
- "Instagram beauty influencers"
- "TikTok gaming content"
- "YouTube tech reviewers"

**Engagement Based:**
- "High engagement creators"
- "Strong performing influencers"
- "Top engagement gaming creators"

**Combined Searches:**
- "Turkish tech creators with high engagement"
- "European Instagram fashion influencers"
- "Gaming creators from Poland"

## Technical Details

### AI Processing Flow
1. User enters natural language query
2. Query sent to `/api/ai-search` endpoint
3. OpenRouter GPT-4o-mini processes query (if API key available)
4. Returns structured filter object
5. Filters applied to search automatically

### Fallback System
If OpenRouter is unavailable:
1. Keyword matching for platforms, locations, verticals
2. Smart detection of engagement terms
3. Name search as final fallback

### Supported Filters
- **Platforms**: Tiktok, Instagram, Youtube
- **Locations**: All countries (TR, US, DE, UK, etc.)
- **Verticals**: Gaming, Tech, Fashion, Beauty, Lifestyle, etc.
- **Engagement**: Very Low, Low, Standard, Strong, Exceptional, Outlier
- **Followers**: All ranges from Mini Micro to Megastar

## Cost Considerations

- **OpenRouter GPT-4o-mini**: ~$0.000150 per 1K input tokens (very affordable)
- **Typical usage**: 1000 queries ≈ $0.15-0.30 depending on query length
- **Competitive pricing**: Often cheaper than direct OpenAI access
- **Fallback available**: Works without API key for basic keyword matching

## Monitoring

Check the browser console for:
- AI processing status
- Fallback activation
- Query translation results
- Error handling

The system gracefully handles all edge cases and provides useful search results regardless of OpenRouter availability.

## Why OpenRouter?

✅ **Cost Effective**: Often 10-30% cheaper than direct OpenAI access
✅ **Reliable**: High uptime and fast response times
✅ **Multiple Models**: Access to various AI models through one API
✅ **Transparent Pricing**: Clear per-token pricing with no hidden costs
✅ **Easy Migration**: Uses OpenAI-compatible API format
