-- SQL 1: Criar ENUMs para tipos de QR code e planos
-- Execute este primeiro no editor SQL do Supabase

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