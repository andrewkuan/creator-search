'use client';

import { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { FilterState } from '@/lib/types';

interface AISearchProps {
  onFiltersChange: (filters: FilterState) => void;
  onSearch: () => void;
  currentFilters: FilterState;
}

export function AISearch({ onFiltersChange, onSearch }: AISearchProps) {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastQuery, setLastQuery] = useState('');

  const processAIQuery = async () => {
    if (!query.trim()) return;
    
    setIsProcessing(true);
    setLastQuery(query);

    try {
      // Call OpenAI API to convert natural language to filters
      const response = await fetch('/api/ai-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to process AI query');
      }

      const { filters } = await response.json();
      
      // Reset all filters and apply only the AI-generated ones
      const resetFilters = {
        name: '',
        platforms: [],
        followerRanges: [],
        locations: [],
        verticals: [],
        engagementRanges: []
      };
      
      onFiltersChange({ ...resetFilters, ...filters });
      
      // Trigger search
      onSearch();
      
    } catch (error) {
      console.error('AI search error:', error);
      // Fallback: reset filters and show all results (no name search)
      const resetFilters = {
        name: '',
        platforms: [],
        followerRanges: [],
        locations: [],
        verticals: [],
        engagementRanges: []
      };
      onFiltersChange(resetFilters);
      onSearch();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      processAIQuery();
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Sparkles className="w-4 h-4 text-purple-500" />
            AI-Powered Search
          </div>
          
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="e.g., 'Find Turkish gaming creators with high engagement' or 'Show Instagram influencers from US'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            
            <Button 
              onClick={processAIQuery}
              disabled={isProcessing || !query.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Search
                </div>
              )}
            </Button>
          </div>
          
          {lastQuery && (
                      <div className="text-xs text-muted-foreground">
            Last search: &ldquo;{lastQuery}&rdquo;
          </div>
          )}
          
          <div className="text-xs text-muted-foreground">
            💡 Try: &ldquo;Turkish tech creators&rdquo;, &ldquo;High engagement gaming influencers&rdquo;, &ldquo;Instagram users from Europe&rdquo;
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
