-- Enable Row Level Security on saved_products table
ALTER TABLE saved_products ENABLE ROW LEVEL SECURITY;

-- Users can only read their own saved products
CREATE POLICY "Users can read own saved products"
ON saved_products
FOR SELECT
USING (auth.uid() = user_id);

-- Users can only insert their own saved products
CREATE POLICY "Users can insert own saved products"
ON saved_products
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own saved products
CREATE POLICY "Users can delete own saved products"
ON saved_products
FOR DELETE
USING (auth.uid() = user_id);
