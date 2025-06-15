
-- This script will reset your application's data for fresh testing.
-- It will delete all transactions, content, and related data,
-- and it will reset all user wallet balances to zero.
-- User accounts and basic profile information will be preserved.

-- Step 1 & 2: Reset All Transaction, Withdrawal, and Content Data
-- Using a single TRUNCATE statement for efficiency.
-- RESTART IDENTITY resets any auto-incrementing counters.
-- CASCADE removes dependent records in other tables.
TRUNCATE
  public.transactions,
  public.platform_fees,
  public.withdrawal_requests,
  public.contents,
  public.comments,
  public.content_views
RESTART IDENTITY CASCADE;

-- Step 3: Reset User Wallet Balances
-- This updates all existing user profiles to have zero earnings and balance.
UPDATE public.profiles
SET
  total_earnings = '0.0',
  available_balance = '0.0',
  updated_at = now();
