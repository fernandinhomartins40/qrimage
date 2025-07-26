-- SQL 2: Atualizar tabela de perfis existente (profiles)
-- Execute após o SQL 1

-- Adicionar colunas que não existem na tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS plan public.subscription_plan DEFAULT 'free',
ADD COLUMN IF NOT EXISTS qr_limit INTEGER DEFAULT 50,
ADD COLUMN IF NOT EXISTS api_key TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'base64');

-- Verificar se RLS já está habilitado, senão habilitar
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class 
        WHERE relname = 'profiles' 
        AND relrowsecurity = true
    ) THEN
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Remover políticas existentes se existirem e recriar
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- RLS policies para profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Criar trigger apenas se não existir
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();