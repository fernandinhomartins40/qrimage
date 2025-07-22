-- Setup script para o novo backend Supabase
-- Execute este SQL no SQL Editor do seu Supabase Dashboard

-- Primeiro, garantir que as extensões estão habilitadas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Criar storage bucket para imagens se não existir
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'images', 
  'images', 
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
) 
ON CONFLICT (id) DO NOTHING;

-- Políticas para o storage bucket
DROP POLICY IF EXISTS "Images are publicly accessible" ON storage.objects;
CREATE POLICY "Images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Anyone can upload images" ON storage.objects;
CREATE POLICY "Anyone can upload images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "Anyone can update images" ON storage.objects;
CREATE POLICY "Anyone can update images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Anyone can delete images" ON storage.objects;
CREATE POLICY "Anyone can delete images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'images');

-- Criar tabela para metadados de imagens e QR codes
DROP TABLE IF EXISTS public.image_qrcodes CASCADE;
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

-- Habilitar Row Level Security
ALTER TABLE public.image_qrcodes ENABLE ROW LEVEL SECURITY;

-- Políticas para acesso público (sem autenticação necessária)
DROP POLICY IF EXISTS "QR codes are publicly viewable" ON public.image_qrcodes;
CREATE POLICY "QR codes are publicly viewable" 
ON public.image_qrcodes 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Anyone can create QR codes" ON public.image_qrcodes;
CREATE POLICY "Anyone can create QR codes" 
ON public.image_qrcodes 
FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update QR codes" ON public.image_qrcodes;
CREATE POLICY "Anyone can update QR codes" 
ON public.image_qrcodes 
FOR UPDATE 
USING (true);

DROP POLICY IF EXISTS "Anyone can delete QR codes" ON public.image_qrcodes;
CREATE POLICY "Anyone can delete QR codes" 
ON public.image_qrcodes 
FOR DELETE 
USING (true);

-- Função para atualizar timestamps automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizações automáticas de timestamp
DROP TRIGGER IF EXISTS update_image_qrcodes_updated_at ON public.image_qrcodes;
CREATE TRIGGER update_image_qrcodes_updated_at
BEFORE UPDATE ON public.image_qrcodes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Comentários para documentação
COMMENT ON TABLE public.image_qrcodes IS 'Tabela para armazenar metadados de imagens e seus QR codes correspondentes';
COMMENT ON COLUMN public.image_qrcodes.id IS 'Identificador único do registro';
COMMENT ON COLUMN public.image_qrcodes.image_name IS 'Nome original da imagem';
COMMENT ON COLUMN public.image_qrcodes.image_type IS 'Tipo MIME da imagem';
COMMENT ON COLUMN public.image_qrcodes.image_path IS 'Caminho da imagem no storage';
COMMENT ON COLUMN public.image_qrcodes.description IS 'Descrição opcional da imagem';
COMMENT ON COLUMN public.image_qrcodes.qr_code_url IS 'URL pública do QR code gerado';
COMMENT ON COLUMN public.image_qrcodes.qr_code_data_url IS 'Data URL do QR code para exibição inline';