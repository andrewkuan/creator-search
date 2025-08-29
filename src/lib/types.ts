// Creator interface matching actual Supabase database schema
export interface Creator {
  UID: string;
  Name: string | null;
  Profile: string | null;
  Email: string | null;
  Platform: 'Tiktok' | 'Instagram' | 'Youtube' | null;
  Followers: number | null;
  Location: string | null;
  Vertical: string | null;
  'File URL': string | null;
  'Updated Date': string | null;
  'Engagement Rate': number | null;
}

// Filter state interface for managing search filters
export interface FilterState {
  name: string;
  platforms: string[];
  followerRanges: string[];
  locations: string[];
  verticals: string[];
  engagementRanges: string[];
}

// Follower range categories
export const FOLLOWER_RANGES = [
  { label: 'Mini Micro (<50k)', value: 'mini-micro', min: 0, max: 49999 },
  { label: 'Micro (50k-100k)', value: 'micro', min: 50000, max: 99999 },
  { label: 'Mid (100k-250k)', value: 'mid', min: 100000, max: 249999 },
  { label: 'Mid Macro (250k-500k)', value: 'mid-macro', min: 250000, max: 499999 },
  { label: 'Macro (500k-1M)', value: 'macro', min: 500000, max: 999999 },
  { label: 'Hero (1M-2M)', value: 'hero', min: 1000000, max: 1999999 },
  { label: 'Megastar (2M+)', value: 'megastar', min: 2000000, max: Infinity },
] as const;

// Engagement rate ranges (values in decimal format to match database)
export const ENGAGEMENT_RANGES = [
  { label: 'Very Low (<1%)', value: 'very-low', min: 0, max: 0.0099 },
  { label: 'Low (1–2%)', value: 'low', min: 0.01, max: 0.0199 },
  { label: 'Standard (2–5%)', value: 'standard', min: 0.02, max: 0.0499 },
  { label: 'Strong (5–10%)', value: 'strong', min: 0.05, max: 0.0999 },
  { label: 'Exceptional (10–20%)', value: 'exceptional', min: 0.10, max: 0.1999 },
  { label: 'Outlier/Review (>20%)', value: 'outlier', min: 0.20, max: Infinity },
] as const;

// Platform options (matching your data)
export const PLATFORMS = ['Tiktok', 'Instagram', 'Youtube'] as const;

// Country code mapping for locations
export const COUNTRY_CODES = {
  'AT': 'Austria',
  'AU': 'Australia', 
  'CA': 'Canada',
  'CZ': 'Czech Republic',
  'DE': 'Germany',
  'ES': 'Spain',
  'EU': 'Europe',
  'FR': 'France',
  'ID': 'Indonesia',
  'IQ': 'Iraq',
  'IT': 'Italy',
  'NL': 'Netherlands',
  'PL': 'Poland',
  'PT': 'Portugal',
  'RU': 'Russia',
  'SG': 'Singapore',
  'TR': 'Turkey',
  'UK': 'United Kingdom',
  'US': 'United States'
} as const;

// Grouped vertical categories (combining similar ones)
export const VERTICAL_GROUPS = [
  { label: 'Gaming', values: ['GAMER', 'Gaming'] as string[] },
  { label: 'Technology', values: ['TECH', 'Tech'] as string[] },
  { label: 'Fashion & Beauty', values: ['Fashion', 'Beauty', 'Fashion & Beauty'] as string[] },
  { label: 'Lifestyle', values: ['Lifestyle', 'Lifestyle/Foodie'] as string[] },
  { label: 'Food', values: ['Foodie'] as string[] },
  { label: 'Family & Parenting', values: ['Family', 'Family Creator', 'Parent'] as string[] },
  { label: 'Home & Interior', values: ['Home and Renovation', 'Home/Interior', 'Home/Interiors'] as string[] },
  { label: 'Fitness & Sport', values: ['Fitness', 'Fitness / Sport', 'Basketball'] as string[] },
  { label: 'Travel', values: ['Travel'] as string[] },
  { label: 'Music', values: ['Music'] as string[] },
  { label: 'Photography', values: ['Photography'] as string[] },
  { label: 'Diversity', values: ['Diversity'] as string[] },
  { label: 'All Categories', values: ['All'] as string[] }
];

// Search response interface
export interface SearchResponse {
  data: Creator[];
  count: number;
  totalCount: number;
}

// Pagination interface
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}
