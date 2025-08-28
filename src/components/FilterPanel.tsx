'use client';

import { useState, useEffect } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Separator } from '@/components/ui/separator';
import { FilterState, PLATFORMS, FOLLOWER_RANGES, ENGAGEMENT_RANGES, COUNTRY_CODES, VERTICAL_GROUPS } from '@/lib/types';
import { getUniqueLocations } from '@/lib/supabase';
import { MultiSelect } from '@/components/ui/multi-select';

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
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Load filter options on mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [locationsData] = await Promise.all([
          getUniqueLocations(),
        ]);
        setLocations(locationsData.filter(loc => loc && loc.trim() !== ''));
      } catch (error) {
        console.error('Failed to load filter options:', error);
      } finally {
        setLoadingOptions(false);
      }
    };

    loadFilterOptions();
  }, []);

  // Prepare dropdown options
  const platformOptions = PLATFORMS.map(platform => ({
    label: platform,
    value: platform
  }));

  const followerOptions = [
    { label: 'Unknown / No Data', value: 'unknown' },
    ...FOLLOWER_RANGES.map(range => ({
      label: range.label,
      value: range.value
    }))
  ];

  const locationOptions = locations.map(location => ({
    label: COUNTRY_CODES[location as keyof typeof COUNTRY_CODES] || location,
    value: location
  }));

  const verticalOptions = VERTICAL_GROUPS.map(group => ({
    label: group.label,
    value: group.label.toLowerCase().replace(/\s+/g, '-')
  }));

  const engagementOptions = ENGAGEMENT_RANGES.map(range => ({
    label: range.label,
    value: range.value
  }));

  const handleNameChange = (value: string) => {
    onFiltersChange({ ...filters, name: value });
  };

  const handlePlatformChange = (values: string[]) => {
    onFiltersChange({ ...filters, platforms: values });
  };

  const handleFollowerChange = (values: string[]) => {
    onFiltersChange({ ...filters, followerRanges: values });
  };

  const handleLocationChange = (values: string[]) => {
    onFiltersChange({ ...filters, locations: values });
  };

  const handleVerticalChange = (values: string[]) => {
    // Convert grouped selections back to individual verticals
    const expandedVerticals: string[] = [];
    values.forEach(groupKey => {
      const group = VERTICAL_GROUPS.find(g => g.label.toLowerCase().replace(/\s+/g, '-') === groupKey);
      if (group) {
        expandedVerticals.push(...group.values);
      }
    });
    onFiltersChange({ ...filters, verticals: expandedVerticals });
  };

  const handleEngagementChange = (values: string[]) => {
    onFiltersChange({ ...filters, engagementRanges: values });
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
          <MultiSelect
            options={platformOptions}
            selected={filters.platforms}
            onChange={handlePlatformChange}
            placeholder="Select platforms..."
          />
        </div>

        <Separator />

        {/* Follower Range Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Follower Count</label>
          <MultiSelect
            options={followerOptions}
            selected={filters.followerRanges}
            onChange={handleFollowerChange}
            placeholder="Select follower ranges..."
          />
        </div>

        <Separator />

        {/* Location Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Location</label>
          {loadingOptions ? (
            <div className="text-sm text-muted-foreground">Loading locations...</div>
          ) : (
            <MultiSelect
              options={locationOptions}
              selected={filters.locations}
              onChange={handleLocationChange}
              placeholder="Select countries..."
            />
          )}
        </div>

        <Separator />

        {/* Vertical Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Vertical</label>
          {loadingOptions ? (
            <div className="text-sm text-muted-foreground">Loading verticals...</div>
          ) : (
            <MultiSelect
              options={verticalOptions}
              selected={filters.verticals.map(v => {
                // Convert back to group keys for display
                const group = VERTICAL_GROUPS.find(g => g.values.includes(v));
                return group ? group.label.toLowerCase().replace(/\s+/g, '-') : v;
              }).filter((v, i, arr) => arr.indexOf(v) === i)} // Remove duplicates
              onChange={handleVerticalChange}
              placeholder="Select verticals..."
            />
          )}
        </div>

        <Separator />

        {/* Engagement Rate Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Engagement Rate</label>
          <MultiSelect
            options={engagementOptions}
            selected={filters.engagementRanges}
            onChange={handleEngagementChange}
            placeholder="Select engagement ranges..."
          />
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
