
-- Add unique constraint to prevent duplicate purchases
ALTER TABLE public.transactions
ADD CONSTRAINT unique_user_content_purchase UNIQUE (user_id, content_id);

-- Create the has_purchased_content function if it doesn't exist
CREATE OR REPLACE FUNCTION public.has_purchased_content(user_id_param UUID, content_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
  purchase_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 
    FROM public.transactions
    WHERE user_id = user_id_param
      AND content_id = content_id_param
      AND is_deleted = FALSE
  ) INTO purchase_exists;
  
  RETURN purchase_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access to the function
GRANT EXECUTE ON FUNCTION public.has_purchased_content(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_purchased_content(UUID, UUID) TO anon;
GRANT EXECUTE ON FUNCTION public.has_purchased_content(UUID, UUID) TO service_role;
