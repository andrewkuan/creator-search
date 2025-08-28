'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Creator } from '@/lib/types';

interface CreatorItemProps {
  creator: Creator;
}

export function CreatorItem({ creator }: CreatorItemProps) {
  const formatFollowers = (followers: number | null): string => {
    if (!followers) return 'N/A';
    
    if (followers >= 1000000) {
      return `${(followers / 1000000).toFixed(1)}M`;
    } else if (followers >= 1000) {
      return `${(followers / 1000).toFixed(1)}K`;
    }
    return followers.toString();
  };

  const formatEngagementRate = (rate: number | null): string => {
    if (!rate) return 'N/A';
    return `${rate.toFixed(2)}%`;
  };

  const getPlatformColor = (platform: string | null): string => {
    switch (platform) {
      case 'Instagram':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'Tiktok':
        return 'bg-black';
      case 'Youtube':
        return 'bg-red-600';
      default:
        return 'bg-gray-500';
    }
  };

  const getFollowerRangeColor = (followers: number | null): string => {
    if (!followers) return 'bg-gray-100 text-gray-800';
    
    if (followers < 50000) return 'bg-blue-100 text-blue-800';
    if (followers < 100000) return 'bg-green-100 text-green-800';
    if (followers < 250000) return 'bg-yellow-100 text-yellow-800';
    if (followers < 500000) return 'bg-orange-100 text-orange-800';
    if (followers < 1000000) return 'bg-red-100 text-red-800';
    if (followers < 2000000) return 'bg-purple-100 text-purple-800';
    return 'bg-pink-100 text-pink-800';
  };

  const getEngagementColor = (rate: number | null): string => {
    if (!rate) return 'bg-gray-100 text-gray-800';
    
    if (rate < 1) return 'bg-red-100 text-red-800';
    if (rate < 2) return 'bg-orange-100 text-orange-800';
    if (rate < 5) return 'bg-yellow-100 text-yellow-800';
    if (rate < 10) return 'bg-green-100 text-green-800';
    if (rate < 20) return 'bg-blue-100 text-blue-800';
    return 'bg-purple-100 text-purple-800';
  };

  const formatCountryName = (countryCode: string | null): string => {
    if (!countryCode || countryCode === '') return 'N/A';
    
    // Country code mapping
    const countryMap: Record<string, string> = {
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
    };
    
    return countryMap[countryCode] || countryCode;
  };

  const formatUpdatedDate = (dateString: string | null): string => {
    if (!dateString) return 'No update date';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="grid grid-cols-7 gap-4 items-center">
          {/* Creator Name */}
          <div className="col-span-2">
            <div className="font-medium text-sm truncate" title={creator.Name || 'Unknown'}>
              {creator.Name || 'Unknown'}
            </div>
          </div>

          {/* Platform */}
          <div>
            <Badge 
              className={`text-white text-xs ${getPlatformColor(creator.Platform)}`}
            >
              {creator.Platform || 'N/A'}
            </Badge>
          </div>

          {/* Followers */}
          <div>
            <Badge 
              variant="secondary" 
              className={`text-xs ${getFollowerRangeColor(creator.Followers)}`}
            >
              {formatFollowers(creator.Followers)}
            </Badge>
          </div>

          {/* Location */}
          <div>
            <div className="text-sm text-muted-foreground truncate" title={formatCountryName(creator.Location)}>
              {formatCountryName(creator.Location)}
            </div>
          </div>

          {/* Vertical */}
          <div>
            <div className="text-sm text-muted-foreground truncate" title={creator.Vertical || 'N/A'}>
              {creator.Vertical || 'N/A'}
            </div>
          </div>

          {/* Data Source & Updated Date */}
          <div className="flex flex-col space-y-1">
            {creator['File URL'] && (
              <a 
                href={creator['File URL']} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 truncate"
                title="Open data source file"
              >
                Data Source
              </a>
            )}
            <div className="text-xs text-muted-foreground" title={formatUpdatedDate(creator['Updated Date'])}>
              {formatUpdatedDate(creator['Updated Date'])}
            </div>
          </div>
        </div>
        
        {/* Second row for additional info */}
        <div className="grid grid-cols-7 gap-4 items-center mt-2 pt-2 border-t border-gray-100">
          <div className="col-span-2 text-xs text-muted-foreground">
            {creator.Email && (
              <a href={`mailto:${creator.Email}`} className="hover:text-blue-600 truncate">
                {creator.Email}
              </a>
            )}
          </div>
          
          <div>
            <Badge 
              variant="secondary" 
              className={`text-xs ${getEngagementColor(creator['Engagement Rate'])}`}
            >
              {formatEngagementRate(creator['Engagement Rate'])} ER
            </Badge>
          </div>
          
          <div className="col-span-2 text-xs text-muted-foreground">
            {creator.Profile && (
              <a 
                href={creator.Profile} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 truncate block"
              >
                View Profile
              </a>
            )}
          </div>

          <div></div> {/* Empty space for alignment */}
          <div></div> {/* Empty space for alignment */}
        </div>
      </CardContent>
    </Card>
  );
}
