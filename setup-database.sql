-- Creator Search Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Create the creators table
CREATE TABLE IF NOT EXISTS creators (
  id SERIAL PRIMARY KEY,
  "Name" TEXT NULL,
  "Platform" TEXT NULL,
  "Followers" BIGINT NULL,
  "Location" TEXT NULL,
  "Vertical" TEXT NULL,
  "Engagement Rate" DOUBLE PRECISION NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add some sample data for testing
INSERT INTO creators ("Name", "Platform", "Followers", "Location", "Vertical", "Engagement Rate") VALUES
('john_foodie', 'Instagram', 75000, 'United States', 'Foodie', 3.2),
('tech_sarah', 'TikTok', 150000, 'Canada', 'Tech', 5.8),
('fitness_mike', 'YouTube', 500000, 'Australia', 'Fitness / Sport', 4.1),
('travel_emma', 'Instagram', 1200000, 'United Kingdom', 'Travel', 2.9),
('beauty_alex', 'TikTok', 85000, 'United States', 'Beauty / Fashion & Beauty', 6.2),
('gaming_pro', 'YouTube', 2500000, 'Germany', 'Gaming / Gamer', 3.7),
('lifestyle_jade', 'Instagram', 320000, 'France', 'Lifestyle', 4.5),
('music_beats', 'TikTok', 650000, 'Brazil', 'Music', 5.3),
('home_design', 'Instagram', 180000, 'Netherlands', 'Home & Renovation / Home/Interior / Home/Interiors', 3.8),
('photo_artist', 'YouTube', 95000, 'Japan', 'Photography', 4.9);

-- Enable Row Level Security (optional - for production)
-- ALTER TABLE creators ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows public read access (adjust as needed)
-- CREATE POLICY "Enable read access for all users" ON creators FOR SELECT USING (true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_creators_platform ON creators("Platform");
CREATE INDEX IF NOT EXISTS idx_creators_followers ON creators("Followers");
CREATE INDEX IF NOT EXISTS idx_creators_location ON creators("Location");
CREATE INDEX IF NOT EXISTS idx_creators_vertical ON creators("Vertical");
CREATE INDEX IF NOT EXISTS idx_creators_engagement ON creators("Engagement Rate");

-- View to check the data
SELECT 
  COUNT(*) as total_creators,
  COUNT(DISTINCT "Platform") as platforms,
  COUNT(DISTINCT "Location") as locations,
  COUNT(DISTINCT "Vertical") as verticals
FROM creators;
