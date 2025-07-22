-- Setup script para o novo backend Supabase
-- Execute este SQL no SQL Editor do seu Supabase Dashboard

-- Primeiro, garantir que as extensões estão habilitadas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================
-- CONFIGURAÇÕES DE AUTENTICAÇÃO
-- ====================================

-- Tabela de perfis de usuário (complementa auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política para visualizar perfis (usuário pode ver próprio perfil)
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Política para atualizar perfis (usuário pode atualizar próprio perfil)
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Política para inserir perfis (usuário pode criar próprio perfil)
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Função para atualizar timestamp de updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at na tabela profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

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
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Políticas com autenticação
DROP POLICY IF EXISTS "QR codes are publicly viewable" ON public.image_qrcodes;
CREATE POLICY "QR codes are publicly viewable" 
ON public.image_qrcodes 
FOR SELECT 
USING (true); -- Mantém visualização pública para compartilhamento

DROP POLICY IF EXISTS "Users can create own QR codes" ON public.image_qrcodes;
CREATE POLICY "Users can create own QR codes" 
ON public.image_qrcodes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own QR codes" ON public.image_qrcodes;
CREATE POLICY "Users can update own QR codes" 
ON public.image_qrcodes 
FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own QR codes" ON public.image_qrcodes;
CREATE POLICY "Users can delete own QR codes" 
ON public.image_qrcodes 
FOR DELETE 
USING (auth.uid() = user_id);

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