-- Enable Row Level Security on all tables that have policies but RLS disabled
-- This fixes the critical security vulnerability

-- Enable RLS on tables
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- Add missing RLS policies for any gaps in coverage
-- These policies ensure proper access control for all operations

-- Storage RLS policies for content-media bucket
CREATE POLICY "Users can view their own files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'content-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'content-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'content-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'content-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Creators can access files for their content
CREATE POLICY "Creators can access content files" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'content-media' 
  AND EXISTS (
    SELECT 1 FROM public.contents 
    WHERE creator_id = auth.uid() 
    AND file_path = name
  )
);

-- Users who purchased content can access the files
CREATE POLICY "Purchasers can access content files" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'content-media' 
  AND EXISTS (
    SELECT 1 FROM public.contents c
    JOIN public.transactions t ON c.id = t.content_id
    WHERE t.user_id = auth.uid() 
    AND t.is_deleted = false
    AND c.file_path = name
  )
);