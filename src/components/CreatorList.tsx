'use client';

import { Creator } from '@/lib/types';
import { CreatorItem } from './CreatorItem';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface CreatorListProps {
  creators: Creator[];
  isLoading: boolean;
  isEmpty: boolean;
}

export function CreatorList({ creators, isLoading, isEmpty }: CreatorListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Searching creators...</p>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium mb-2">No creators found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search filters or search terms.
            </p>
            <div className="text-sm text-muted-foreground">
              <p>Tips:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Remove some filters to broaden your search</li>
                <li>Check your spelling in the name search</li>
                <li>Try different platform or vertical combinations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* List Header */}
      <Card>
        <CardContent className="py-3">
          <div className="grid grid-cols-7 gap-4 text-sm font-medium text-muted-foreground">
            <div className="col-span-2">Creator Name</div>
            <div>Platform</div>
            <div>Followers</div>
            <div>Location</div>
            <div>Vertical</div>
            <div>Data Source & Last Updated</div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Creator Items */}
      <div className="space-y-2">
        {creators.map((creator) => (
          <CreatorItem key={creator.UID} creator={creator} />
        ))}
      </div>

      {/* Footer info */}
      {creators.length > 0 && (
        <div className="text-center text-sm text-muted-foreground py-4">
          Showing {creators.length} creators
        </div>
      )}
    </div>
  );
}
