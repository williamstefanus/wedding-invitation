INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery', 'gallery', true) 
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'gallery' );

CREATE POLICY "Allow authenticated uploads" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'gallery' );

CREATE POLICY "Allow authenticated updates" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'gallery' );

CREATE POLICY "Allow authenticated deletes" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'gallery' );
