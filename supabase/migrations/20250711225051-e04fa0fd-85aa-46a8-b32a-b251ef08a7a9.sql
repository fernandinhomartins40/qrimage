-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- Create storage policies for images
CREATE POLICY "Images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'images');

CREATE POLICY "Anyone can upload images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Anyone can update images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'images');

CREATE POLICY "Anyone can delete images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'images');

-- Create table for image metadata and QR codes
CREATE TABLE public.image_qrcodes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_name TEXT NOT NULL,
  image_type TEXT NOT NULL,
  image_path TEXT NOT NULL,
  description TEXT,
  qr_code_url TEXT,
  qr_code_data_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.image_qrcodes ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since no authentication is required)
CREATE POLICY "QR codes are publicly viewable" 
ON public.image_qrcodes 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create QR codes" 
ON public.image_qrcodes 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update QR codes" 
ON public.image_qrcodes 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete QR codes" 
ON public.image_qrcodes 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_image_qrcodes_updated_at
BEFORE UPDATE ON public.image_qrcodes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();