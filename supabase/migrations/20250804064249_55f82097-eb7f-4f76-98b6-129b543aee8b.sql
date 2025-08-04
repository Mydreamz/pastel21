-- Step 1: Add unique constraint to prevent duplicate transactions
ALTER TABLE public.transactions 
ADD CONSTRAINT unique_razorpay_payment UNIQUE (razorpay_payment_id);

-- Step 2: Add unique constraint for order + user combination
ALTER TABLE public.transactions 
ADD CONSTRAINT unique_content_user_order UNIQUE (content_id, user_id, razorpay_order_id);

-- Step 3: Fix the creator earnings trigger to prevent double updates
DROP TRIGGER IF EXISTS update_creator_balance_trigger ON public.transactions;

CREATE OR REPLACE FUNCTION public.update_creator_balance_on_transaction()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only update balance for successful payments and prevent duplicates
  IF NEW.payment_status = 'success' AND NEW.is_deleted = false THEN
    -- Check if this payment has already been processed
    IF EXISTS (
      SELECT 1 FROM public.transactions 
      WHERE razorpay_payment_id = NEW.razorpay_payment_id 
      AND id != NEW.id 
      AND payment_status = 'success'
      AND is_deleted = false
    ) THEN
      -- Payment already processed, don't update balance
      RAISE LOG 'Duplicate payment detected for payment_id: %, skipping balance update', NEW.razorpay_payment_id;
      RETURN NEW;
    END IF;

    -- Update the creator's profile with new earnings from the transaction
    UPDATE public.profiles
    SET
      total_earnings = (COALESCE(total_earnings::numeric, 0) + NEW.creator_earnings::numeric)::text,
      available_balance = (COALESCE(available_balance::numeric, 0) + NEW.creator_earnings::numeric)::text
    WHERE id = NEW.creator_id;
    
    RAISE LOG 'Updated creator balance for creator_id: %, earnings: %', NEW.creator_id, NEW.creator_earnings;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create the trigger
CREATE TRIGGER update_creator_balance_trigger
  AFTER INSERT ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_creator_balance_on_transaction();

-- Step 4: Clean up existing duplicate data
-- First, identify and remove duplicate transactions (keep the first one)
DELETE FROM public.transactions t1
WHERE EXISTS (
  SELECT 1 FROM public.transactions t2 
  WHERE t2.razorpay_payment_id = t1.razorpay_payment_id
  AND t2.id < t1.id
  AND t1.razorpay_payment_id IS NOT NULL
);

-- Step 5: Recalculate creator earnings correctly
-- Reset and recalculate all creator balances
UPDATE public.profiles 
SET 
  total_earnings = COALESCE(earnings_calc.total, 0)::text,
  available_balance = COALESCE(
    earnings_calc.total - COALESCE(withdrawn.total, 0), 
    0
  )::text
FROM (
  SELECT 
    creator_id,
    SUM(creator_earnings::numeric) as total
  FROM public.transactions 
  WHERE payment_status = 'success' 
  AND is_deleted = false
  GROUP BY creator_id
) earnings_calc
LEFT JOIN (
  SELECT 
    user_id,
    SUM(amount) as total
  FROM public.withdrawal_requests 
  WHERE status = 'completed'
  GROUP BY user_id
) withdrawn ON withdrawn.user_id = earnings_calc.creator_id
WHERE profiles.id = earnings_calc.creator_id;