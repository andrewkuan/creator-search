# Creator Search - Project Overview

## Project Description

Creator Search is an internal agency tool designed to help discover and filter creators based on specific criteria. The application connects to a Supabase database and provides an intuitive interface for searching through creator profiles across Instagram, TikTok, and YouTube.

## Target Users

- Internal agency team members
- Campaign managers
- Account executives
- Strategy team members

## Core Features

### Filter Capabilities
- **Name**: Text search for creator usernames/handles
- **Platform**: Instagram, TikTok, YouTube
- **Followers**: Categorized follower ranges
- **Location**: Country-based filtering
- **Vertical**: Industry/niche categories
- **Engagement Rate**: Performance-based filtering

### User Experience
- List view display for optimal data scanning
- Real-time result count display
- Pagination (50 results per page)
- Search button to apply filters
- Reset button to clear all filters
- Desktop-optimized interface

## Technical Architecture

### Frontend Stack
- **Framework**: Next.js 14+ (React)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React hooks (useState, useEffect)
- **HTTP Client**: Supabase JavaScript client

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Not required (public access)
- **API**: Supabase REST API with built-in filtering

### Deployment
- **Platform**: Vercel
- **Environment**: Production-ready with environment variables

## Database Schema

### Creators Table
```sql
CREATE TABLE creators (
  id SERIAL PRIMARY KEY,
  "Name" TEXT NULL,
  "Platform" TEXT NULL,
  "Followers" BIGINT NULL,
  "Location" TEXT NULL,
  "Vertical" TEXT NULL,
  "Engagement Rate" DOUBLE PRECISION NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Platform Values
- Instagram
- TikTok  
- YouTube

### Follower Categories
- **Mini Micro**: <50k
- **Micro**: 50k-100k
- **Mid**: 100k-250k
- **Mid Macro**: 250k-500k
- **Macro**: 500k-1M
- **Hero**: 1M-2M
- **Megastar**: 2M+

### Engagement Rate Ranges
- **Very Low**: <1%
- **Low**: 1–2%
- **Standard**: 2–5%
- **Strong**: 5–10%
- **Exceptional**: 10–20%
- **Outlier/Review**: >20%

### Vertical Categories
- Foodie
- Lifestyle
- Family / Family Creator / Parent
- Tech
- Gaming / Gamer
- Fitness / Sport
- Fashion
- Beauty / Fashion & Beauty
- Travel
- Music
- Home & Renovation / Home/Interior / Home/Interiors
- Photography
- All
- Diversity
- Basketball

## Implementation Plan

### Phase 1: Project Setup
1. Initialize Next.js project with TypeScript
2. Install and configure Tailwind CSS
3. Set up shadcn/ui components
4. Configure Supabase client
5. Set up environment variables

### Phase 2: Core Components
1. **FilterPanel Component**
   - Name search input
   - Platform multi-select
   - Follower range selector
   - Location dropdown
   - Vertical multi-select
   - Engagement rate range selector
   - Search and Reset buttons

2. **CreatorList Component**
   - List view layout
   - Creator item cards
   - Loading states
   - Empty states

3. **Pagination Component**
   - Page navigation
   - Results count display
   - Items per page: 50

### Phase 3: Data Integration
1. Supabase query functions
2. Filter logic implementation
3. Search functionality
4. Pagination logic
5. Error handling

### Phase 4: UI Polish
1. Responsive design tweaks
2. Loading animations
3. Error messages
4. Performance optimization

### Phase 5: Deployment
1. Environment configuration
2. Vercel deployment setup
3. Domain configuration
4. Performance monitoring

## File Structure
```
creator-search/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── FilterPanel.tsx
│   ├── CreatorList.tsx
│   ├── CreatorItem.tsx
│   ├── Pagination.tsx
│   └── Layout.tsx
├── lib/
│   ├── supabase.ts        # Supabase client
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Utility functions
├── pages/
│   ├── api/               # API routes (if needed)
│   ├── _app.tsx
│   ├── _document.tsx
│   └── index.tsx          # Main page
├── styles/
│   └── globals.css
├── public/
├── .env.local             # Environment variables
├── next.config.js
├── tailwind.config.js
├── components.json        # shadcn/ui config
└── package.json
```

## Key Components Implementation

### Creator Type Definition
```typescript
interface Creator {
  id: number;
  Name: string | null;
  Platform: 'Instagram' | 'TikTok' | 'YouTube' | null;
  Followers: number | null;
  Location: string | null;
  Vertical: string | null;
  'Engagement Rate': number | null;
  created_at: string;
}
```

### Filter State Management
```typescript
interface FilterState {
  name: string;
  platforms: string[];
  followerRanges: string[];
  locations: string[];
  verticals: string[];
  engagementRanges: string[];
}
```

## Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Success Metrics
- Fast search results (<2 seconds)
- Intuitive filter combinations
- Accurate result counts
- Smooth pagination experience
- Zero-downtime deployment

## Future Enhancements (Post-MVP)
- Export functionality (CSV/Excel)
- Saved search templates
- Creator profile detail views
- Advanced sorting options
- Mobile responsiveness
- User authentication for different access levels
- Analytics dashboard
- Bulk operations

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account with existing creators table
- Vercel account for deployment

### Development Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run development server: `npm run dev`
5. Open http://localhost:3000

### Deployment
1. Connect repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy with automatic deployments on main branch

## Support and Maintenance
- Regular Supabase query optimization
- Performance monitoring via Vercel Analytics
- User feedback collection for iterative improvements
- Database maintenance and scaling considerations

---

**Project Timeline**: 2-3 weeks
**Team Size**: 1-2 developers
**Priority**: High (Internal Tool)