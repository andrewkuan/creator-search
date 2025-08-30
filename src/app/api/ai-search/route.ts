import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { saveQueryRecord } from '@/lib/supabase';

// Initialize OpenRouter client
function getOpenRouterClient() {
  if (!process.env.OPENROUTER_API_KEY) {
    return null;
  }
  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    // Try to get OpenRouter client
    const openai = getOpenRouterClient();
    
    // If no OpenRouter API key, fall back to simple keyword matching
    if (!openai) {
      const fallbackFilters = createFallbackFilters(query);
      
      // Save query record for no-API-key case (fire and forget)
      const chatgptQuery = JSON.stringify(fallbackFilters, null, 2);
      const supabaseQuery = filtersToQueryDescription(fallbackFilters);
      
      saveQueryRecord({
        user_query: query,
        chatgpt_query: `NO_API_KEY: ${chatgptQuery}`,
        supabase_query: supabaseQuery
      }).catch(error => {
        console.error('Failed to save no-API-key query record:', error);
      });
      
      return NextResponse.json({ filters: fallbackFilters });
    }

    const systemPrompt = `You are a search query translator for a creator database. Convert natural language queries into structured filters.

Available filter options:
- platforms: array of ["Tiktok", "Instagram", "Youtube"]
- locations: array of country codes ["TR", "US", "DE", "UK", "CA", "AU", "FR", "IT", "ES", "NL", "PL", "PT", "RU", "SG", "CZ", "AT", "EU", "ID", "IQ"]
- verticals: array from ["GAMER", "Gaming", "TECH", "Tech", "Fashion", "Beauty", "Fashion & Beauty", "Lifestyle", "Lifestyle/Foodie", "Foodie", "Family", "Family Creator", "Parent", "Home and Renovation", "Home/Interior", "Home/Interiors", "Fitness", "Fitness / Sport", "Basketball", "Travel", "Music", "Photography", "Diversity", "All"]
- followerRanges: array from ["unknown", "mini-micro", "micro", "mid", "mid-macro", "macro", "hero", "megastar"]
- engagementRanges: array from ["very-low", "low", "standard", "strong", "exceptional", "outlier"]

Country mappings: Turkey=TR, United States=US, Germany=DE, United Kingdom=UK, Canada=CA, Australia=AU, France=FR, Italy=IT, Spain=ES, Netherlands=NL, Poland=PL, Portugal=PT, Russia=RU, Singapore=SG, Czech Republic=CZ, Austria=AT, Europe=EU, Indonesia=ID, Iraq=IQ

Return ONLY a JSON object with the filters. If no specific filters are mentioned, return empty object {}.

Examples:
"Turkish gaming creators" → {"locations": ["TR"], "verticals": ["GAMER", "Gaming"]}
"High engagement Instagram users" → {"platforms": ["Instagram"], "engagementRanges": ["strong", "exceptional", "outlier"]}
"Tech influencers from Europe" → {"verticals": ["TECH", "Tech"], "locations": ["EU", "DE", "FR", "IT", "ES", "NL"]}`;

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-5-nano", // OpenRouter format for GPT-5-nano
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
      ],
      temperature: 0.1,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from OpenRouter');
    }

    // Parse the JSON response
    let filters;
    try {
      filters = JSON.parse(response);
    } catch {
      console.error('Failed to parse OpenRouter response:', response);
      // Fallback to simple keyword matching
      filters = createFallbackFilters(query);
    }

    // Save query record to database (fire and forget)
    const chatgptQuery = JSON.stringify(filters, null, 2);
    const supabaseQuery = filtersToQueryDescription(filters);
    
    saveQueryRecord({
      user_query: query,
      chatgpt_query: chatgptQuery,
      supabase_query: supabaseQuery
    }).catch(error => {
      console.error('Failed to save query record:', error);
      // Don't fail the request if logging fails
    });

    return NextResponse.json({ filters });

  } catch (error) {
    console.error('AI search error:', error);
    
    // Fallback to simple keyword matching
    const { query } = await request.json();
    const fallbackFilters = createFallbackFilters(query);
    
    // Save query record for fallback case (fire and forget)
    const chatgptQuery = JSON.stringify(fallbackFilters, null, 2);
    const supabaseQuery = filtersToQueryDescription(fallbackFilters);
    
    saveQueryRecord({
      user_query: query,
      chatgpt_query: `FALLBACK: ${chatgptQuery}`,
      supabase_query: supabaseQuery
    }).catch(logError => {
      console.error('Failed to save fallback query record:', logError);
    });
    
    return NextResponse.json({ filters: fallbackFilters });
  }
}

// Simple fallback filter creation based on keywords
function createFallbackFilters(query: string): Record<string, unknown> {
  const lowerQuery = query.toLowerCase();
  const filters: Record<string, unknown> = {};

  // Platform detection
  if (lowerQuery.includes('instagram') || lowerQuery.includes('ig')) {
    filters.platforms = ['Instagram'];
  } else if (lowerQuery.includes('tiktok') || lowerQuery.includes('tik tok')) {
    filters.platforms = ['Tiktok'];
  } else if (lowerQuery.includes('youtube') || lowerQuery.includes('yt')) {
    filters.platforms = ['Youtube'];
  }

  // Location detection
  const locationMap: Record<string, string> = {
    'turkey': 'TR', 'turkish': 'TR',
    'usa': 'US', 'america': 'US', 'united states': 'US',
    'germany': 'DE', 'german': 'DE',
    'uk': 'UK', 'britain': 'UK', 'united kingdom': 'UK',
    'canada': 'CA', 'canadian': 'CA',
    'australia': 'AU', 'australian': 'AU',
    'france': 'FR', 'french': 'FR',
    'europe': 'EU', 'european': 'EU'
  };

  for (const [keyword, code] of Object.entries(locationMap)) {
    if (lowerQuery.includes(keyword)) {
      filters.locations = [code];
      break;
    }
  }

  // Vertical detection
  if (lowerQuery.includes('gaming') || lowerQuery.includes('gamer')) {
    filters.verticals = ['GAMER', 'Gaming'];
  } else if (lowerQuery.includes('tech')) {
    filters.verticals = ['TECH', 'Tech'];
  } else if (lowerQuery.includes('fashion') || lowerQuery.includes('beauty')) {
    filters.verticals = ['Fashion', 'Beauty', 'Fashion & Beauty'];
  } else if (lowerQuery.includes('food')) {
    filters.verticals = ['Foodie'];
  } else if (lowerQuery.includes('travel')) {
    filters.verticals = ['Travel'];
  } else if (lowerQuery.includes('fitness') || lowerQuery.includes('sport')) {
    filters.verticals = ['Fitness', 'Fitness / Sport'];
  }

  // Engagement detection
  if (lowerQuery.includes('high engagement') || lowerQuery.includes('strong engagement')) {
    filters.engagementRanges = ['strong', 'exceptional', 'outlier'];
  } else if (lowerQuery.includes('low engagement')) {
    filters.engagementRanges = ['very-low', 'low'];
  }

  // Only add name search if explicitly mentioned
  if (lowerQuery.includes('named') || lowerQuery.includes('called') || lowerQuery.startsWith('find ')) {
    filters.name = query;
  }

  return filters;
}

// Convert filter object to human-readable Supabase query description
function filtersToQueryDescription(filters: Record<string, unknown>): string {
  const conditions: string[] = [];

  if (filters.name && typeof filters.name === 'string') {
    conditions.push(`Name ILIKE '%${filters.name}%'`);
  }

  if (filters.platforms && Array.isArray(filters.platforms)) {
    conditions.push(`Platform IN (${filters.platforms.map(p => `'${p}'`).join(', ')})`);
  }

  if (filters.locations && Array.isArray(filters.locations)) {
    conditions.push(`Location IN (${filters.locations.map(l => `'${l}'`).join(', ')})`);
  }

  if (filters.verticals && Array.isArray(filters.verticals)) {
    conditions.push(`Vertical IN (${filters.verticals.map(v => `'${v}'`).join(', ')})`);
  }

  if (filters.followerRanges && Array.isArray(filters.followerRanges)) {
    const ranges = filters.followerRanges.map(range => {
      switch (range) {
        case 'mini-micro': return 'Followers BETWEEN 0 AND 49999';
        case 'micro': return 'Followers BETWEEN 50000 AND 99999';
        case 'mid': return 'Followers BETWEEN 100000 AND 249999';
        case 'mid-macro': return 'Followers BETWEEN 250000 AND 499999';
        case 'macro': return 'Followers BETWEEN 500000 AND 999999';
        case 'hero': return 'Followers BETWEEN 1000000 AND 1999999';
        case 'megastar': return 'Followers >= 2000000';
        default: return `Followers: ${range}`;
      }
    });
    conditions.push(`(${ranges.join(' OR ')})`);
  }

  if (filters.engagementRanges && Array.isArray(filters.engagementRanges)) {
    const ranges = filters.engagementRanges.map(range => {
      switch (range) {
        case 'very-low': return 'Engagement Rate < 0.01';
        case 'low': return 'Engagement Rate BETWEEN 0.01 AND 0.0199';
        case 'standard': return 'Engagement Rate BETWEEN 0.02 AND 0.0499';
        case 'strong': return 'Engagement Rate BETWEEN 0.05 AND 0.0999';
        case 'exceptional': return 'Engagement Rate BETWEEN 0.10 AND 0.1999';
        case 'outlier': return 'Engagement Rate >= 0.20';
        default: return `Engagement Rate: ${range}`;
      }
    });
    conditions.push(`(${ranges.join(' OR ')})`);
  }

  if (conditions.length === 0) {
    return 'SELECT * FROM creator_list ORDER BY Name ASC';
  }

  return `SELECT * FROM creator_list WHERE ${conditions.join(' AND ')} ORDER BY Name ASC`;
}
