# 🤖 AI-Powered Search Setup

## Overview

The Creator Search app now includes AI-powered natural language search using OpenAI's GPT-4o-mini model. Users can search using phrases like "Turkish gaming creators with high engagement" instead of manually setting filters.

## Features

✅ **Natural Language Processing**: Convert queries like "Turkish tech creators" into structured filters
✅ **Smart Fallback**: Works even without OpenAI API key using keyword matching
✅ **Real-time Processing**: Instant translation of queries to database filters
✅ **User Friendly**: Provides example queries and shows last search

## Setup Instructions

### 1. Get OpenAI API Key (Optional but Recommended)

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key (starts with `sk-...`)

### 2. Add Environment Variables

**For Local Development:**
Add to your `.env.local` file:
```env
OPENAI_API_KEY=sk-your-openai-key-here
```

**For Vercel Deployment:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `OPENAI_API_KEY` = `sk-your-openai-key-here`
3. Set for Production, Preview, and Development environments

### 3. Without OpenAI API Key

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
3. OpenAI GPT-4o-mini processes query (if API key available)
4. Returns structured filter object
5. Filters applied to search automatically

### Fallback System
If OpenAI is unavailable:
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

- **GPT-4o-mini**: ~$0.0001 per query (very affordable)
- **Typical usage**: 1000 queries = ~$0.10
- **Fallback available**: Works without API key for basic keyword matching

## Monitoring

Check the browser console for:
- AI processing status
- Fallback activation
- Query translation results
- Error handling

The system gracefully handles all edge cases and provides useful search results regardless of OpenAI availability.
