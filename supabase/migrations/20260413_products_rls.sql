-- Enable Row Level Security on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow anyone (including signed-out users) to read products
CREATE POLICY "Anyone can read products"
ON products
FOR SELECT
USING (true);

-- Allow only authenticated (signed-in) users to add or edit products
CREATE POLICY "Authenticated users can write products"
ON products
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
