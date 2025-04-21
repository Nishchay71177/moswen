
-- Add new columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS profession TEXT,
ADD COLUMN IF NOT EXISTS age TEXT,
ADD COLUMN IF NOT EXISTS standard TEXT;

-- Create storage bucket for avatars if it doesn't exist already
INSERT INTO storage.buckets (id, name, public)
SELECT 'avatars', 'avatars', true
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'avatars'
);

-- Create policy for public access to avatars
INSERT INTO storage.policies (name, definition, bucket_id)
SELECT 
    'Public Read Access',
    '{ "bucket_id": "avatars", "operation": "read", "permission": "public" }',
    'avatars'
WHERE NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE bucket_id = 'avatars' AND name = 'Public Read Access'
);

-- Create policy for authenticated uploads to avatars
INSERT INTO storage.policies (name, definition, bucket_id)
SELECT 
    'Authenticated User Upload',
    '{ "bucket_id": "avatars", "operation": "insert", "permission": "authenticated" }',
    'avatars'
WHERE NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE bucket_id = 'avatars' AND name = 'Authenticated User Upload'
);
