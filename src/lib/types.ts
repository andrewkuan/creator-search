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

// Engagement rate ranges
export const ENGAGEMENT_RANGES = [
  { label: 'Very Low (<1%)', value: 'very-low', min: 0, max: 0.99 },
  { label: 'Low (1–2%)', value: 'low', min: 1, max: 1.99 },
  { label: 'Standard (2–5%)', value: 'standard', min: 2, max: 4.99 },
  { label: 'Strong (5–10%)', value: 'strong', min: 5, max: 9.99 },
  { label: 'Exceptional (10–20%)', value: 'exceptional', min: 10, max: 19.99 },
  { label: 'Outlier/Review (>20%)', value: 'outlier', min: 20, max: Infinity },
] as const;

// Platform options (matching your data)
export const PLATFORMS = ['Tiktok', 'Instagram', 'Youtube'] as const;

// Vertical categories (matching your data - mixed case formats)
export const VERTICALS = [
  'GAMER',
  'Gamer', 
  'Gaming',
  'TECH',
  'Tech',
  'Technology',
  'LIFESTYLE',
  'Lifestyle',
  'FASHION',
  'Fashion',
  'BEAUTY',
  'Beauty',
  'TRAVEL',
  'Travel',
  'MUSIC',
  'Music',
  'FOOD',
  'Food',
  'Foodie',
  'FITNESS',
  'Fitness',
  'ALL',
  'All',
] as const;

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
