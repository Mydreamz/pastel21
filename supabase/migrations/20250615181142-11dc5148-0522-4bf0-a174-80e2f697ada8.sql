
-- Create a function to update creator earnings automatically
CREATE OR REPLACE FUNCTION public.update_creator_balance_on_transaction()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update the creator's profile with new earnings from the transaction
  -- It safely handles NULLs by treating them as 0
  UPDATE public.profiles
  SET
    total_earnings = (COALESCE(total_earnings::numeric, 0) + NEW.creator_earnings::numeric)::text,
    available_balance = (COALESCE(available_balance::numeric, 0) + NEW.creator_earnings::numeric)::text
  WHERE id = NEW.creator_id;
  RETURN NEW;
END;
$$;

-- Drop trigger if it exists to avoid errors on re-run
DROP TRIGGER IF EXISTS on_new_transaction_update_balance ON public.transactions;

-- Create a trigger that executes the function after a new transaction is inserted
CREATE TRIGGER on_new_transaction_update_balance
AFTER INSERT ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_creator_balance_on_transaction();

-- Policies for the 'transactions' table
-- Drop existing policies to redefine them
DROP POLICY IF EXISTS "Creator can view own earnings" ON public.transactions;
DROP POLICY IF EXISTS "Allow users to view their transactions" ON public.transactions;
DROP POLICY IF EXISTS "Allow authenticated users to insert transactions" ON public.transactions;

-- Allow users to insert their own transactions (purchases)
CREATE POLICY "Allow authenticated users to insert transactions"
ON public.transactions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users (both purchasers and creators) to view their related transactions
CREATE POLICY "Allow users to view their transactions"
ON public.transactions FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR auth.uid() = creator_id);
