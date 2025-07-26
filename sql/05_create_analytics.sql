-- SQL 5: Criar tabela de analytics (qr_scans)
-- Execute após o SQL 4

-- Create qr_scans table for analytics
CREATE TABLE public.qr_scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  qr_code_id UUID NOT NULL REFERENCES public.image_qrcodes(id) ON DELETE CASCADE,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  referrer TEXT
);

-- Enable RLS
ALTER TABLE public.qr_scans ENABLE ROW LEVEL SECURITY;

-- RLS policies for qr_scans 
CREATE POLICY "Users can view scans of their QR codes" 
ON public.qr_scans FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.image_qrcodes 
    WHERE id = qr_code_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Public can insert scan analytics" 
ON public.qr_scans FOR INSERT 
WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_qr_scans_qr_code_id ON public.qr_scans(qr_code_id);
CREATE INDEX idx_qr_scans_scanned_at ON public.qr_scans(scanned_at);