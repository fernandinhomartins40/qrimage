-- Migration: Expand QR System for SaaS Platform
-- Create comprehensive schema for multi-type QR codes with analytics and user management

-- Create enum for QR code types
CREATE TYPE public.qr_code_type AS ENUM (
  'url',
  'text', 
  'wifi',
  'vcard',
  'sms',
  'whatsapp',
  'email', 
  'phone',
  'location',
  'event',
  'pix'
);

-- Create enum for subscription plans
CREATE TYPE public.subscription_plan AS ENUM (
  'free',
  'pro',
  'business', 
  'enterprise'
);

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  plan public.subscription_plan DEFAULT 'free',
  qr_limit INTEGER DEFAULT 50,
  api_key TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'base64'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create campaigns table for organization
CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

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

-- Create qr_templates table for design templates
CREATE TABLE public.qr_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  config JSONB NOT NULL DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create subscriptions table for billing
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan public.subscription_plan NOT NULL,
  status TEXT DEFAULT 'active',
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY; 
ALTER TABLE public.qr_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

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

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- RLS policies for campaigns
CREATE POLICY "Users can manage their own campaigns" 
ON public.campaigns FOR ALL 
USING (auth.uid() = user_id);

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

-- RLS policies for templates
CREATE POLICY "Users can view public templates and their own" 
ON public.qr_templates FOR SELECT 
USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can manage their own templates" 
ON public.qr_templates FOR ALL 
USING (auth.uid() = user_id);

-- RLS policies for subscriptions
CREATE POLICY "Users can view their own subscription" 
ON public.subscriptions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription" 
ON public.subscriptions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" 
ON public.subscriptions FOR UPDATE 
USING (auth.uid() = user_id);

-- Create updated_at triggers
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
BEFORE UPDATE ON public.campaigns
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

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

-- Trigger to enforce QR limits
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
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default templates
INSERT INTO public.qr_templates (name, description, category, config, is_public) VALUES
('Simples', 'Template básico sem customizações', 'basic', '{"color": "#000000", "background": "#ffffff"}', true),
('Colorido', 'Template com cores vibrantes', 'colorful', '{"color": "#3B82F6", "background": "#F0F9FF"}', true),
('Empresarial', 'Template profissional para empresas', 'business', '{"color": "#1F2937", "background": "#F9FAFB", "logo": true}', true),
('Restaurante', 'Template otimizado para cardápios', 'restaurant', '{"color": "#DC2626", "background": "#FEF2F2"}', true);

-- Create indexes for performance
CREATE INDEX idx_image_qrcodes_user_id ON public.image_qrcodes(user_id);
CREATE INDEX idx_image_qrcodes_type ON public.image_qrcodes(qr_type);
CREATE INDEX idx_image_qrcodes_short_url ON public.image_qrcodes(short_url);
CREATE INDEX idx_qr_scans_qr_code_id ON public.qr_scans(qr_code_id);
CREATE INDEX idx_qr_scans_scanned_at ON public.qr_scans(scanned_at);
CREATE INDEX idx_campaigns_user_id ON public.campaigns(user_id);

-- Create view for QR analytics
CREATE VIEW public.qr_analytics AS
SELECT 
  iqr.id,
  iqr.image_name,
  iqr.qr_type,
  iqr.scan_count,
  iqr.created_at,
  COUNT(qs.id) as total_scans,
  COUNT(DISTINCT qs.ip_address) as unique_visitors,
  MAX(qs.scanned_at) as last_scan,
  iqr.user_id
FROM public.image_qrcodes iqr
LEFT JOIN public.qr_scans qs ON qs.qr_code_id = iqr.id
GROUP BY iqr.id, iqr.image_name, iqr.qr_type, iqr.scan_count, iqr.created_at, iqr.user_id;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;