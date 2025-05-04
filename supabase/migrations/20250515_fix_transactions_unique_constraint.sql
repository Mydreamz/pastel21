
-- Add a unique constraint to prevent duplicate purchases
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'transactions_content_id_user_id_key'
  ) THEN
    ALTER TABLE public.transactions
    ADD CONSTRAINT transactions_content_id_user_id_key UNIQUE (content_id, user_id);
  END IF;
END
$$;

-- Refresh the view to ensure columns are properly recognized
DO $$
BEGIN
  EXECUTE 'DROP VIEW IF EXISTS processed_transactions CASCADE';
  
  EXECUTE 'CREATE VIEW processed_transactions AS
    SELECT 
      id,
      content_id,
      user_id,
      creator_id,
      amount,
      COALESCE(platform_fee, ''0.0'') as platform_fee,
      COALESCE(creator_earnings, ''0.0'') as creator_earnings,
      timestamp,
      COALESCE(status, ''completed'') as status,
      is_deleted
    FROM 
      transactions';
END
$$;

-- Ensure these columns exist
DO $$
BEGIN
  BEGIN
    ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS platform_fee TEXT DEFAULT '0.0';
    ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS creator_earnings TEXT DEFAULT '0.0';
    ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed';
  EXCEPTION
    WHEN duplicate_column THEN
      -- Do nothing, column already exists
  END;
END
$$;
