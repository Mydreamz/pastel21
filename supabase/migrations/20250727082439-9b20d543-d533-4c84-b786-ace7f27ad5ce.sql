-- Clear all existing data from tables (keep table structure)
DELETE FROM public.comments WHERE true;
DELETE FROM public.content_views WHERE true;
DELETE FROM public.platform_fees WHERE true;
DELETE FROM public.transactions WHERE true;
DELETE FROM public.withdrawal_requests WHERE true;
DELETE FROM public.withdrawal_details WHERE true;
DELETE FROM public.orders WHERE true;
DELETE FROM public.contents WHERE true;
DELETE FROM public.profiles WHERE true;