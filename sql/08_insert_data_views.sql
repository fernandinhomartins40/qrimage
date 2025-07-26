-- SQL 8: Inserir dados iniciais e criar views
-- Execute após o SQL 7

-- Insert default templates
INSERT INTO public.qr_templates (name, description, category, config, is_public) VALUES
('Simples', 'Template básico sem customizações', 'basic', '{"color": "#000000", "background": "#ffffff"}', true),
('Colorido', 'Template com cores vibrantes', 'colorful', '{"color": "#3B82F6", "background": "#F0F9FF"}', true),
('Empresarial', 'Template profissional para empresas', 'business', '{"color": "#1F2937", "background": "#F9FAFB", "logo": true}', true),
('Restaurante', 'Template otimizado para cardápios', 'restaurant', '{"color": "#DC2626", "background": "#FEF2F2"}', true);

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