
-- Create table for withdrawal requests
CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  amount DECIMAL NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  
  -- Bank details
  account_holder_name TEXT,
  account_number TEXT,
  ifsc_code TEXT,
  bank_name TEXT,
  
  -- UPI details
  upi_id TEXT,
  
  -- PAN and contact details
  pan_number TEXT NOT NULL,
  pan_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add RLS policies for withdrawal_requests table
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own withdrawal requests
CREATE POLICY "Users can create their own withdrawal requests"
  ON public.withdrawal_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to view only their own withdrawal requests
CREATE POLICY "Users can view their own withdrawal requests"
  ON public.withdrawal_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER withdrawal_requests_updated_at
BEFORE UPDATE ON withdrawal_requests
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();
