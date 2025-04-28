
-- Create a storage bucket for content media files
INSERT INTO storage.buckets (id, name, public)
VALUES ('content-media', 'content-media', true);

-- Set up policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'content-media');

-- Set up policy to allow public access to view files
CREATE POLICY "Allow public to view files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'content-media');

-- Set up policy to allow users to update their own files
CREATE POLICY "Allow users to update their own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'content-media' AND auth.uid() = owner);

-- Set up policy to allow users to delete their own files
CREATE POLICY "Allow users to delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'content-media' AND auth.uid() = owner);
