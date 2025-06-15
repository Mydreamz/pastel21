
-- First, drop the dependent view that caused the error
DROP VIEW IF EXISTS public.processed_transactions;

-- Now, we can re-run the previous script

-- Drop policies added in recent migrations
DROP POLICY IF EXISTS "Enable read access for admins" ON public.platform_fees;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow authenticated users to read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated read access to published content" ON public.contents;
DROP POLICY IF EXISTS "Allow users to create their own content" ON public.contents;
DROP POLICY IF EXISTS "Allow users to update their own content" ON public.contents;
DROP POLICY IF EXISTS "Allow users to delete their own content" ON public.contents;
DROP POLICY IF EXISTS "Allow authenticated read access to comments" ON public.comments;
DROP POLICY IF EXISTS "Allow users to create comments" ON public.comments;
DROP POLICY IF EXISTS "Allow users to update their own comments" ON public.comments;
DROP POLICY IF EXISTS "Allow users to delete their own comments" ON public.comments;
DROP POLICY IF EXISTS "Allow users to view their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Allow user to see their withdrawal requests" ON public.withdrawal_requests;
DROP POLICY IF EXISTS "Allow user to create withdrawal requests" ON public.withdrawal_requests;
DROP POLICY IF EXISTS "Allow user to manage their own withdrawal details" ON public.withdrawal_details;
DROP POLICY IF EXISTS "Allow users to see their own payment sessions" ON public.payment_sessions;
DROP POLICY IF EXISTS "Users can view their own payment sessions" ON public.payment_sessions;
DROP POLICY IF EXISTS "Users can create their own payment sessions" ON public.payment_sessions;
DROP POLICY IF EXISTS "Service role can update payment sessions" ON public.payment_sessions;
DROP POLICY IF EXISTS "Allow creators to view their content's views" ON public.content_views;

-- Disable RLS on tables where it was enabled
ALTER TABLE public.contents DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_details DISABLE ROW LEVEL SECURITY;
-- The following tables may have already been dropped, but we include this for completeness
ALTER TABLE public.payment_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_views DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_fees DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.encryption_keys DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Drop functions added in recent migrations
DROP FUNCTION IF EXISTS public.reencrypt_column(text, text);
DROP FUNCTION IF EXISTS public.decrypt_data(text);
DROP FUNCTION IF EXISTS public.encrypt_data(text);
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

-- Drop tables and types added in recent migrations
DROP TABLE IF EXISTS public.payment_sessions;
DROP TABLE IF EXISTS public.user_roles;
DROP TABLE IF EXISTS public.encryption_keys;
DROP TYPE IF EXISTS public.payment_status_enum;
DROP TYPE IF EXISTS public.app_role;

-- Drop columns added to transactions table
ALTER TABLE public.transactions
DROP COLUMN IF EXISTS payment_method,
DROP COLUMN IF EXISTS gateway_transaction_id,
DROP COLUMN IF EXISTS gateway_response,
DROP COLUMN IF EXISTS status;
