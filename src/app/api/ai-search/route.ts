import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI only when needed
function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
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

    // Try to get OpenAI client
    const openai = getOpenAIClient();
    
    // If no OpenAI API key, fall back to simple keyword matching
    if (!openai) {
      const fallbackFilters = createFallbackFilters(query);
      return NextResponse.json({ filters: fallbackFilters });
    }

    const systemPrompt = `You are a search query translator for a creator database. Convert natural language queries into structured filters.

Available filter options:
- name: string (creator name search)
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
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
      ],
      temperature: 0.1,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    let filters;
    try {
      filters = JSON.parse(response);
    } catch {
      console.error('Failed to parse OpenAI response:', response);
      // Fallback to simple keyword matching
      filters = createFallbackFilters(query);
    }

    return NextResponse.json({ filters });

  } catch (error) {
    console.error('AI search error:', error);
    
    // Fallback to simple keyword matching
    const { query } = await request.json();
    const fallbackFilters = createFallbackFilters(query);
    
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

  // If it looks like a name search, add it
  if (Object.keys(filters).length === 0 || lowerQuery.includes('named') || lowerQuery.includes('called')) {
    filters.name = query;
  }

  return filters;
}
