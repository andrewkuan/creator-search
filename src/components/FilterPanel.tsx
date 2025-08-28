'use client';

import { useState, useEffect } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FilterState, PLATFORMS, FOLLOWER_RANGES, ENGAGEMENT_RANGES } from '@/lib/types';
import { getUniqueLocations, getUniqueVerticals } from '@/lib/supabase';

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onSearch: () => void;
  onReset: () => void;
  resultsCount: number;
  isLoading: boolean;
}

export function FilterPanel({
  filters,
  onFiltersChange,
  onSearch,
  onReset,
  resultsCount,
  isLoading,
}: FilterPanelProps) {
  const [locations, setLocations] = useState<string[]>([]);
  const [verticals, setVerticals] = useState<string[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Load filter options on mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [locationsData, verticalsData] = await Promise.all([
          getUniqueLocations(),
          getUniqueVerticals(),
        ]);
        setLocations(locationsData);
        setVerticals(verticalsData);
      } catch (error) {
        console.error('Failed to load filter options:', error);
      } finally {
        setLoadingOptions(false);
      }
    };

    loadFilterOptions();
  }, []);

  const handleNameChange = (value: string) => {
    onFiltersChange({ ...filters, name: value });
  };

  const togglePlatform = (platform: string) => {
    const newPlatforms = filters.platforms.includes(platform)
      ? filters.platforms.filter(p => p !== platform)
      : [...filters.platforms, platform];
    onFiltersChange({ ...filters, platforms: newPlatforms });
  };

  const toggleFollowerRange = (range: string) => {
    const newRanges = filters.followerRanges.includes(range)
      ? filters.followerRanges.filter(r => r !== range)
      : [...filters.followerRanges, range];
    onFiltersChange({ ...filters, followerRanges: newRanges });
  };

  const toggleLocation = (location: string) => {
    const newLocations = filters.locations.includes(location)
      ? filters.locations.filter(l => l !== location)
      : [...filters.locations, location];
    onFiltersChange({ ...filters, locations: newLocations });
  };

  const toggleVertical = (vertical: string) => {
    const newVerticals = filters.verticals.includes(vertical)
      ? filters.verticals.filter(v => v !== vertical)
      : [...filters.verticals, vertical];
    onFiltersChange({ ...filters, verticals: newVerticals });
  };

  const toggleEngagementRange = (range: string) => {
    const newRanges = filters.engagementRanges.includes(range)
      ? filters.engagementRanges.filter(r => r !== range)
      : [...filters.engagementRanges, range];
    onFiltersChange({ ...filters, engagementRanges: newRanges });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Search Filters</span>
          <div className="text-sm font-normal text-muted-foreground">
            {isLoading ? 'Searching...' : `${resultsCount.toLocaleString()} results`}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Name Search */}
        <div>
          <label className="text-sm font-medium mb-2 block">Creator Name</label>
          <Input
            type="text"
            placeholder="Search by creator name..."
            value={filters.name}
            onChange={(e) => handleNameChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full"
          />
        </div>

        <Separator />

        {/* Platform Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Platform</label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((platform) => (
              <Badge
                key={platform}
                variant={filters.platforms.includes(platform) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => togglePlatform(platform)}
              >
                {platform}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Follower Range Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Follower Count</label>
          <div className="flex flex-wrap gap-2">
            {FOLLOWER_RANGES.map((range) => (
              <Badge
                key={range.value}
                variant={filters.followerRanges.includes(range.value) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => toggleFollowerRange(range.value)}
              >
                {range.label}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Location Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Location</label>
          {loadingOptions ? (
            <div className="text-sm text-muted-foreground">Loading locations...</div>
          ) : (
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {locations.map((location) => (
                <Badge
                  key={location}
                  variant={filters.locations.includes(location) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => toggleLocation(location)}
                >
                  {location}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Vertical Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Vertical</label>
          {loadingOptions ? (
            <div className="text-sm text-muted-foreground">Loading verticals...</div>
          ) : (
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {verticals.map((vertical) => (
                <Badge
                  key={vertical}
                  variant={filters.verticals.includes(vertical) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => toggleVertical(vertical)}
                >
                  {vertical}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Engagement Rate Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Engagement Rate</label>
          <div className="flex flex-wrap gap-2">
            {ENGAGEMENT_RANGES.map((range) => (
              <Badge
                key={range.value}
                variant={filters.engagementRanges.includes(range.value) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => toggleEngagementRange(range.value)}
              >
                {range.label}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button 
            onClick={onSearch} 
            disabled={isLoading}
            className="flex-1"
          >
            <Search className="w-4 h-4 mr-2" />
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
          <Button 
            variant="outline" 
            onClick={onReset}
            disabled={isLoading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
