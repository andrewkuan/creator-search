# Creator Search

An internal agency tool for discovering and filtering creators across Instagram, TikTok, and YouTube. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Advanced Filtering**: Filter creators by name, platform, follower count, location, vertical, and engagement rate
- **Real-time Search**: Fast search with live result counts
- **Pagination**: Browse through results with 50 creators per page
- **Responsive Design**: Optimized for desktop use with clean, professional interface
- **Type Safety**: Full TypeScript implementation for robust development

## Tech Stack

- **Frontend**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (PostgreSQL)
- **Language**: TypeScript
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account with creators table

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd creator-search
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application expects a Supabase table named `creators` with the following structure:

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

### Sample Data

Platform values: `Instagram`, `TikTok`, `YouTube`

Follower ranges:
- Mini Micro: <50k
- Micro: 50k-100k  
- Mid: 100k-250k
- Mid Macro: 250k-500k
- Macro: 500k-1M
- Hero: 1M-2M
- Megastar: 2M+

Engagement rate ranges:
- Very Low: <1%
- Low: 1–2%
- Standard: 2–5% 
- Strong: 5–10%
- Exceptional: 10–20%
- Outlier/Review: >20%

## Project Structure

```
creator-search/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── FilterPanel.tsx  # Search filters interface
│   │   ├── CreatorList.tsx  # Results list display
│   │   ├── CreatorItem.tsx  # Individual creator card
│   │   └── SearchPagination.tsx # Pagination controls
│   └── lib/
│       ├── types.ts         # TypeScript type definitions
│       ├── supabase.ts      # Database client & queries
│       └── utils.ts         # Utility functions
├── public/
├── .env.example            # Environment variables template
├── .env.local             # Your environment variables (create this)
├── components.json        # shadcn/ui configuration
├── next.config.js
├── tailwind.config.js
└── package.json
```

## Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   - Push your code to GitHub
   - Connect repository to Vercel
   - Vercel will auto-detect Next.js

2. **Set Environment Variables**
   In Vercel dashboard, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Deploy**
   - Automatic deployments on main branch pushes
   - Preview deployments for pull requests

### Manual Deployment

```bash
npm run build
npm run start
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding Components

Add new shadcn/ui components:
```bash
npx shadcn@latest add [component-name]
```

### Database Queries

All database interactions are in `src/lib/supabase.ts`. The main functions:

- `searchCreators()` - Main search with filters and pagination
- `getUniqueLocations()` - Get all locations for filter dropdown
- `getUniqueVerticals()` - Get all verticals for filter dropdown
- `testConnection()` - Test database connectivity

## Performance

- **Search Results**: < 2 seconds for most queries
- **Pagination**: 50 results per page for optimal loading
- **Caching**: Browser caching for static assets
- **Optimization**: Next.js automatic code splitting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues or questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include error messages and reproduction steps

## License

Internal agency tool - All rights reserved

---

**Built with ❤️ for efficient creator discovery**