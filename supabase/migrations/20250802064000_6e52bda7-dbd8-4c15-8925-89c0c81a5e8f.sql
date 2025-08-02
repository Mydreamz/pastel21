-- Fix function search paths for security
ALTER FUNCTION public.update_updated_at_column() SET search_path = 'public';
ALTER FUNCTION public.create_profile_on_signup() SET search_path = 'public';
ALTER FUNCTION public.insert_platform_fee() SET search_path = 'public';
ALTER FUNCTION public.get_protected_file_url(uuid, text) SET search_path = 'public';
ALTER FUNCTION public.get_pending_withdrawals(uuid) SET search_path = 'public';
ALTER FUNCTION public.update_timestamp() SET search_path = 'public';
ALTER FUNCTION public.has_purchased_content(uuid, uuid) SET search_path = 'public';
ALTER FUNCTION public.update_creator_balance_on_transaction() SET search_path = 'public';