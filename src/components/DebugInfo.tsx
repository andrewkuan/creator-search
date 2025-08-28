'use client';

// Temporary debug component to check environment variables on Vercel
export function DebugInfo() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Only show debug info in development or if there's an issue
  if (process.env.NODE_ENV === 'production' && supabaseUrl && supabaseKey) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-xs max-w-sm">
      <div className="font-semibold">Debug Info:</div>
      <div>URL: {supabaseUrl ? '✅ Set' : '❌ Missing'}</div>
      <div>Key: {supabaseKey ? '✅ Set' : '❌ Missing'}</div>
      <div>URL Preview: {supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'Not found'}</div>
      <div>Key Preview: {supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'Not found'}</div>
    </div>
  );
}
