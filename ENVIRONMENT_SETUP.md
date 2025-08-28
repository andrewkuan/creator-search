# Environment Setup Instructions

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## How to Get Supabase Credentials

1. **Log in to Supabase**: Go to [supabase.com](https://supabase.com) and log in to your account
2. **Select your project**: Choose the project that contains your creators table
3. **Go to Settings**: Click on the Settings icon in the sidebar
4. **Navigate to API**: Click on "API" in the Settings menu
5. **Copy credentials**:
   - **Project URL**: Copy the URL under "Project URL" 
   - **Anon Key**: Copy the key under "Project API keys" → "anon public"

## Example .env.local File

```bash
# Replace these with your actual values
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key-here
```

## Security Notes

- Never commit `.env.local` to version control (it's already in .gitignore)
- The anon key is safe to use in client-side code as it respects Row Level Security (RLS)
- Make sure your Supabase table has appropriate RLS policies if needed

## Testing the Connection

After setting up your environment variables, you can test the connection by:

1. Running the development server: `npm run dev`
2. Opening [http://localhost:3000](http://localhost:3000)
3. The app should load and display creators from your database

If you see connection errors, double-check your environment variables and Supabase project settings.
