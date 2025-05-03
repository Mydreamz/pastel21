
-- Update the transactions table to include fee distribution fields
ALTER TABLE public.transactions
ADD COLUMN IF NOT EXISTS platform_fee TEXT DEFAULT '0.0',
ADD COLUMN IF NOT EXISTS creator_earnings TEXT DEFAULT '0.0',
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed';

-- Add total_earnings and available_balance to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS total_earnings TEXT DEFAULT '0.0',
ADD COLUMN IF NOT EXISTS available_balance TEXT DEFAULT '0.0';

-- Update RLS policies to allow the appropriate access
CREATE POLICY IF NOT EXISTS "Creator can view own earnings" ON public.transactions
FOR SELECT
USING (creator_id = auth.uid());

-- Policy for updating profile earnings (to be used by service role only)
CREATE POLICY IF NOT EXISTS "Allow service role to update profiles" ON public.profiles
FOR UPDATE
USING (true);
