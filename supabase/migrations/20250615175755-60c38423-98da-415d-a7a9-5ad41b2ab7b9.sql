
-- Drop existing policies on content-media bucket if they exist, to start clean.
DROP POLICY IF EXISTS "Allow authenticated users to upload files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to view files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow owners to select their own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow file owners to update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow file owners to delete their own files" ON storage.objects;


-- Create a private storage bucket for content media files.
-- Using a private bucket ensures files are only accessible via secure, time-limited signed URLs.
INSERT INTO storage.buckets (id, name, public)
VALUES ('content-media', 'content-media', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Set up RLS policies for the content-media bucket.

-- 1. Allow authenticated users to upload files into their own folder.
-- The folder is expected to be named after the user's ID.
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'content-media' AND
  auth.uid() = (storage.foldername(name))[1]::uuid
);

-- 2. Allow file owners to select their own files (e.g. for previews, management).
CREATE POLICY "Allow owners to select their own files"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'content-media' AND
  auth.uid() = owner
);

-- 3. Allow file owners to update their own files.
CREATE POLICY "Allow file owners to update their own files"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'content-media' AND
  auth.uid() = owner
);

-- 4. Allow file owners to delete their own files.
CREATE POLICY "Allow file owners to delete their own files"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'content-media' AND
  auth.uid() = owner
);


-- Create/replace the has_purchased_content function.
-- This function is crucial for the secure-media edge function to determine
-- if a user has access rights to a piece of content (either as creator or purchaser).
CREATE OR REPLACE FUNCTION public.has_purchased_content(user_id_param uuid, content_id_param uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  has_purchased BOOLEAN;
BEGIN
  -- First, check if the user is the creator of the content.
  SELECT EXISTS (
    SELECT 1
    FROM public.contents
    WHERE id = content_id_param AND creator_id = user_id_param
  ) INTO has_purchased;

  -- If the user is not the creator, then check if they have a valid purchase transaction.
  IF NOT has_purchased THEN
    SELECT EXISTS (
      SELECT 1
      FROM public.transactions
      WHERE transactions.content_id = content_id_param
      AND transactions.user_id = user_id_param
      AND transactions.is_deleted = false
    ) INTO has_purchased;
  END IF;

  RETURN has_purchased;
END;
$function$;

-- Grant execute permission on the function to relevant roles.
-- Authenticated users will call this via RPC from the secure-media edge function.
GRANT EXECUTE ON FUNCTION public.has_purchased_content(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_purchased_content(UUID, UUID) TO anon;
GRANT EXECUTE ON FUNCTION public.has_purchased_content(UUID, UUID) TO service_role;
