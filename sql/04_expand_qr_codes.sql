-- SQL 4: Expandir tabela image_qrcodes para suportar múltiplos tipos
-- Execute após o SQL 3

-- Expand image_qrcodes table to support all QR types
ALTER TABLE public.image_qrcodes 
ADD COLUMN user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
ADD COLUMN campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
ADD COLUMN qr_type public.qr_code_type DEFAULT 'url',
ADD COLUMN content JSONB NOT NULL DEFAULT '{}',
ADD COLUMN settings JSONB DEFAULT '{}',
ADD COLUMN is_active BOOLEAN DEFAULT true,
ADD COLUMN short_url TEXT UNIQUE,
ADD COLUMN scan_count INTEGER DEFAULT 0;

-- Update RLS policies for image_qrcodes
DROP POLICY IF EXISTS "QR codes are publicly viewable" ON public.image_qrcodes;
DROP POLICY IF EXISTS "Anyone can create QR codes" ON public.image_qrcodes;
DROP POLICY IF EXISTS "Anyone can update QR codes" ON public.image_qrcodes;
DROP POLICY IF EXISTS "Anyone can delete QR codes" ON public.image_qrcodes;

-- New RLS policies for authenticated users
CREATE POLICY "Users can view their own QR codes" 
ON public.image_qrcodes FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create QR codes" 
ON public.image_qrcodes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own QR codes" 
ON public.image_qrcodes FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own QR codes" 
ON public.image_qrcodes FOR DELETE 
USING (auth.uid() = user_id);

-- Public access for scanning (view endpoint)
CREATE POLICY "Public can view active QR codes for scanning" 
ON public.image_qrcodes FOR SELECT 
USING (is_active = true);

-- Create indexes
CREATE INDEX idx_image_qrcodes_user_id ON public.image_qrcodes(user_id);
CREATE INDEX idx_image_qrcodes_type ON public.image_qrcodes(qr_type);
CREATE INDEX idx_image_qrcodes_short_url ON public.image_qrcodes(short_url);