-- SQL 4: Atualizar tabela image_qrcodes existente
-- Execute após o SQL 3

-- Adicionar apenas as colunas que não existem
ALTER TABLE public.image_qrcodes 
ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS qr_type public.qr_code_type DEFAULT 'url',
ADD COLUMN IF NOT EXISTS content JSONB NOT NULL DEFAULT '{}',
ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS short_url TEXT,
ADD COLUMN IF NOT EXISTS scan_count INTEGER DEFAULT 0;

-- Adicionar constraint UNIQUE para short_url se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'image_qrcodes_short_url_key'
    ) THEN
        ALTER TABLE public.image_qrcodes 
        ADD CONSTRAINT image_qrcodes_short_url_key UNIQUE (short_url);
    END IF;
END $$;

-- Adicionar foreign key para user_id se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'image_qrcodes_user_id_fkey'
    ) THEN
        ALTER TABLE public.image_qrcodes 
        ADD CONSTRAINT image_qrcodes_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "QR codes are publicly viewable" ON public.image_qrcodes;
DROP POLICY IF EXISTS "Anyone can create QR codes" ON public.image_qrcodes;
DROP POLICY IF EXISTS "Anyone can update QR codes" ON public.image_qrcodes;
DROP POLICY IF EXISTS "Anyone can delete QR codes" ON public.image_qrcodes;

-- Novas políticas RLS para usuários autenticados
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

-- Acesso público para scanning (view endpoint)
CREATE POLICY "Public can view active QR codes for scanning" 
ON public.image_qrcodes FOR SELECT 
USING (is_active = true);

-- Criar índices se não existirem
CREATE INDEX IF NOT EXISTS idx_image_qrcodes_user_id ON public.image_qrcodes(user_id);
CREATE INDEX IF NOT EXISTS idx_image_qrcodes_type ON public.image_qrcodes(qr_type);
CREATE INDEX IF NOT EXISTS idx_image_qrcodes_short_url ON public.image_qrcodes(short_url);