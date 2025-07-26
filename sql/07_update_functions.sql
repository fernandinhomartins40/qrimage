-- SQL 7: Criar/atualizar funções utilitárias
-- Execute após o SQL 6

-- Function to increment scan count
CREATE OR REPLACE FUNCTION public.increment_scan_count(qr_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.image_qrcodes 
  SET scan_count = scan_count + 1 
  WHERE id = qr_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check user QR limit
CREATE OR REPLACE FUNCTION public.check_qr_limit()
RETURNS TRIGGER AS $$
DECLARE
  user_qr_count INTEGER;
  user_limit INTEGER;
BEGIN
  SELECT COUNT(*), p.qr_limit 
  INTO user_qr_count, user_limit
  FROM public.image_qrcodes iqr
  JOIN public.profiles p ON p.id = NEW.user_id
  WHERE iqr.user_id = NEW.user_id
  GROUP BY p.qr_limit;
  
  IF user_qr_count >= user_limit THEN
    RAISE EXCEPTION 'QR code limit exceeded. Upgrade your plan to create more QR codes.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remover trigger se existir e recriar
DROP TRIGGER IF EXISTS enforce_qr_limit ON public.image_qrcodes;
CREATE TRIGGER enforce_qr_limit
BEFORE INSERT ON public.image_qrcodes
FOR EACH ROW EXECUTE FUNCTION public.check_qr_limit();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING; -- Evitar erro se perfil já existir
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verificar se trigger já existe antes de criar
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'on_auth_user_created'
    ) THEN
        CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    END IF;
END $$;