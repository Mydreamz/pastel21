
-- Create an RPC function to safely get pending withdrawals total
CREATE OR REPLACE FUNCTION public.get_pending_withdrawals(user_id_param UUID)
RETURNS numeric AS $$
DECLARE
  withdrawals_total numeric := 0;
  table_exists boolean;
BEGIN
  -- Check if withdrawal_requests table exists
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'withdrawal_requests'
  ) INTO table_exists;
  
  -- If table exists, calculate total
  IF table_exists THEN
    SELECT COALESCE(SUM(CAST(amount AS numeric)), 0)
    INTO withdrawals_total
    FROM public.withdrawal_requests
    WHERE 
      user_id = user_id_param AND 
      status IN ('pending', 'processing');
  END IF;
  
  RETURN withdrawals_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access to the function
GRANT EXECUTE ON FUNCTION public.get_pending_withdrawals(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_pending_withdrawals(UUID) TO anon;
GRANT EXECUTE ON FUNCTION public.get_pending_withdrawals(UUID) TO service_role;
