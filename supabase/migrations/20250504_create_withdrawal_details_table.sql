
-- Create table for saved withdrawal details
CREATE TABLE IF NOT EXISTS public.withdrawal_details (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  
  -- Bank details
  account_holder_name TEXT,
  account_number TEXT,
  ifsc_code TEXT,
  bank_name TEXT,
  
  -- UPI details
  upi_id TEXT,
  
  -- PAN and contact details
  pan_number TEXT,
  pan_name TEXT,
  phone_number TEXT,
  
  -- Status fields
  is_verified BOOLEAN DEFAULT false,
  verification_date TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add RLS policies for withdrawal_details table
ALTER TABLE public.withdrawal_details ENABLE ROW LEVEL SECURITY;

-- Allow users to view only their own withdrawal details
CREATE POLICY "Users can view their own withdrawal details"
  ON public.withdrawal_details
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow system to insert/update withdrawal details (handled by Edge Functions)
CREATE POLICY "Allow system to manage withdrawal details"
  ON public.withdrawal_details
  USING (true);

-- Trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_withdrawal_details_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER withdrawal_details_updated_at
BEFORE UPDATE ON withdrawal_details
FOR EACH ROW
EXECUTE PROCEDURE update_withdrawal_details_timestamp();
