import { createClient } from '@supabase/supabase-js';
import { Creator, FilterState, SearchResponse, FOLLOWER_RANGES, ENGAGEMENT_RANGES } from './types';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Search creators with filters and pagination
export async function searchCreators(
  filters: FilterState,
  page: number = 1,
  limit: number = 50
): Promise<SearchResponse> {
  try {
    let query = supabase.from('creators').select('*', { count: 'exact' });

    // Apply name filter
    if (filters.name.trim()) {
      query = query.ilike('Name', `%${filters.name.trim()}%`);
    }

    // Apply platform filter
    if (filters.platforms.length > 0) {
      query = query.in('Platform', filters.platforms);
    }

    // Apply location filter
    if (filters.locations.length > 0) {
      query = query.in('Location', filters.locations);
    }

    // Apply vertical filter
    if (filters.verticals.length > 0) {
      query = query.in('Vertical', filters.verticals);
    }

    // Apply follower range filter
    if (filters.followerRanges.length > 0) {
      const followerConditions: string[] = [];
      
      filters.followerRanges.forEach(rangeValue => {
        const range = FOLLOWER_RANGES.find(r => r.value === rangeValue);
        if (range) {
          if (range.max === Infinity) {
            followerConditions.push(`Followers.gte.${range.min}`);
          } else {
            followerConditions.push(`and(Followers.gte.${range.min},Followers.lte.${range.max})`);
          }
        }
      });

      if (followerConditions.length > 0) {
        // Use OR logic for multiple follower ranges
        query = query.or(followerConditions.join(','));
      }
    }

    // Apply engagement rate filter
    if (filters.engagementRanges.length > 0) {
      const engagementConditions: string[] = [];
      
      filters.engagementRanges.forEach(rangeValue => {
        const range = ENGAGEMENT_RANGES.find(r => r.value === rangeValue);
        if (range) {
          if (range.max === Infinity) {
            engagementConditions.push(`"Engagement Rate".gte.${range.min}`);
          } else {
            engagementConditions.push(`and("Engagement Rate".gte.${range.min},"Engagement Rate".lte.${range.max})`);
          }
        }
      });

      if (engagementConditions.length > 0) {
        // Use OR logic for multiple engagement ranges
        query = query.or(engagementConditions.join(','));
      }
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    // Order by created_at for consistent results
    query = query.order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      console.error('Error searching creators:', error);
      throw new Error(`Failed to search creators: ${error.message}`);
    }

    return {
      data: data || [],
      count: data?.length || 0,
      totalCount: count || 0,
    };
  } catch (error) {
    console.error('Error in searchCreators:', error);
    throw error;
  }
}

// Get unique locations for filter dropdown
export async function getUniqueLocations(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('creators')
      .select('Location')
      .not('Location', 'is', null)
      .order('Location');

    if (error) {
      console.error('Error fetching locations:', error);
      return [];
    }

    // Extract unique locations
    const uniqueLocations = Array.from(
      new Set(data?.map(item => item.Location).filter(Boolean))
    );

    return uniqueLocations;
  } catch (error) {
    console.error('Error getting unique locations:', error);
    return [];
  }
}

// Get unique verticals for filter dropdown
export async function getUniqueVerticals(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('creators')
      .select('Vertical')
      .not('Vertical', 'is', null)
      .order('Vertical');

    if (error) {
      console.error('Error fetching verticals:', error);
      return [];
    }

    // Extract unique verticals
    const uniqueVerticals = Array.from(
      new Set(data?.map(item => item.Vertical).filter(Boolean))
    );

    return uniqueVerticals;
  } catch (error) {
    console.error('Error getting unique verticals:', error);
    return [];
  }
}

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('creators')
      .select('count')
      .limit(1);

    return !error;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}
