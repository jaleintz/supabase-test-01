-- Create the urls table
CREATE TABLE IF NOT EXISTS urls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create an index on added_at for faster queries
CREATE INDEX IF NOT EXISTS idx_urls_added_at ON urls(added_at DESC);

-- Enable Row Level Security
ALTER TABLE urls ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now (you can restrict this later)
CREATE POLICY "Allow all operations on urls" ON urls
  FOR ALL
  USING (true)
  WITH CHECK (true);
