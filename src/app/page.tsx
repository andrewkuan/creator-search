'use client';

import { useState, useEffect, useCallback } from 'react';
import { FilterPanel } from '@/components/FilterPanel';
import { CreatorList } from '@/components/CreatorList';
import { SearchPagination } from '@/components/SearchPagination';
import { AISearch } from '@/components/AISearch';
import { Creator, FilterState, PaginationState } from '@/lib/types';
import { searchCreators } from '@/lib/supabase';
import { Separator } from '@/components/ui/separator';
import { DebugInfo } from '@/components/DebugInfo';

const initialFilters: FilterState = {
  name: '',
  platforms: [],
  followerRanges: [],
  locations: [],
  verticals: [],
  engagementRanges: [],
};

const initialPagination: PaginationState = {
  currentPage: 1,
  totalPages: 0,
  totalItems: 0,
  itemsPerPage: 50,
};

export default function HomePage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [pagination, setPagination] = useState<PaginationState>(initialPagination);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search function
  const performSearch = useCallback(async (page: number = 1) => {
    console.log('🔍 HomePage: performSearch called with page:', page, 'filters:', filters);
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await searchCreators(filters, page, pagination.itemsPerPage);
      console.log('🔍 HomePage: searchCreators response:', response);
      
      setCreators(response.data);
      setPagination({
        currentPage: page,
        totalPages: Math.ceil(response.totalCount / pagination.itemsPerPage),
        totalItems: response.totalCount,
        itemsPerPage: pagination.itemsPerPage,
      });
      setHasSearched(true);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while searching');
      setCreators([]);
      setPagination(initialPagination);
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.itemsPerPage]);

  // Handle search button click
  const handleSearch = () => {
    console.log('🔍 HomePage: handleSearch called, about to call performSearch(1)');
    performSearch(1);
  };

  // Handle filters reset
  const handleReset = () => {
    setFilters(initialFilters);
    setCreators([]);
    setPagination(initialPagination);
    setHasSearched(false);
    setError(null);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    performSearch(page);
  };

  // Handle filters change
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // Initial search on mount (load all creators)
  useEffect(() => {
    performSearch(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array for initial load only

  const isEmpty = hasSearched && creators.length === 0 && !isLoading;
  const resultsCount = pagination.totalItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Creator Search</h1>
            <p className="mt-2 text-gray-600">
              Discover and filter creators across Instagram, TikTok, and YouTube
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* AI Search Bar */}
        <AISearch
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
          currentFilters={filters}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <FilterPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onSearch={handleSearch}
                onReset={handleReset}
                resultsCount={resultsCount}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3">
            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <h3 className="font-medium">Search Error</h3>
                <p>{error}</p>
              </div>
            )}

            {/* Results */}
            <div className="space-y-6">
              <CreatorList 
                creators={creators} 
                isLoading={isLoading} 
                isEmpty={isEmpty}
              />

              {/* Pagination */}
              {!isEmpty && !isLoading && (
                <>
                  <Separator />
                  <SearchPagination
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    isLoading={isLoading}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>Creator Search - Internal Agency Tool</p>
            <p className="mt-1">
              Connected to Supabase • Built with Next.js & Tailwind CSS
            </p>
          </div>
        </div>
      </footer>

      {/* Debug component to check env vars on Vercel */}
      <DebugInfo />
    </div>
  );
}