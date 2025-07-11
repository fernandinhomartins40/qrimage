import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Image as ImageIcon, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ImageQRCodeData {
  id: string;
  image_name: string;
  image_type: string;
  image_path: string;
  description: string;
  qr_code_url: string;
  qr_code_data_url: string;
  created_at: string;
  updated_at: string;
}

export default function ImageView() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [imageData, setImageData] = useState<ImageQRCodeData | null>(null);
  const [loading, setLoading] = useState(true);

  // Extract URL parameters
  const mode = searchParams.get('mode');
  const backgroundColor = searchParams.get('bg');
  const isViewOnlyMode = mode === 'view-only';
  const bgColor = backgroundColor ? `#${backgroundColor}` : '#3b82f6';

  useEffect(() => {
    const loadImageData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        // Buscar os dados no Supabase usando o timestamp do ID
        // Buscar pela URL base (sem parâmetros) ou pela URL completa
        const baseUrl = `${window.location.origin}/view/${id}`;
        const { data, error } = await supabase
          .from('image_qrcodes')
          .select('*')
          .or(`qr_code_url.eq.${baseUrl},qr_code_url.like.${baseUrl}?%`)
          .maybeSingle();

        if (error) {
          console.error('Erro ao carregar dados da imagem:', error);
        } else {
          setImageData(data);
        }
      } catch (error) {
        console.error('Erro ao carregar dados da imagem:', error);
      }

      setLoading(false);
    };

    loadImageData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-16 w-16 bg-primary/20 rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!imageData) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-gradient-card backdrop-blur-sm border-border/50 shadow-soft">
          <CardContent className="p-8 text-center">
            <div className="p-4 rounded-full bg-destructive/10 w-fit mx-auto mb-4">
              <ImageIcon className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Imagem não encontrada
            </h1>
            <p className="text-muted-foreground">
              A imagem que você está procurando não foi encontrada ou pode ter expirado.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render view-only mode
  if (isViewOnlyMode) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: bgColor }}
      >
        <div className="max-w-4xl w-full">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
            <img 
              src={imageData.image_path} 
              alt={imageData.image_name}
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    );
  }

  // Render normal mode
  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-4xl mx-auto">

        {/* Main Content */}
        <Card className="bg-gradient-card backdrop-blur-sm border-border/50 shadow-elegant">
          <CardContent className="p-8">
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Visualização da Imagem
              </h1>
              <p className="text-muted-foreground">
                Compartilhada via QR Code
              </p>
            </div>

            {/* Image Display */}
            <div className="mb-8">
              <div className="relative overflow-hidden rounded-xl border-2 border-border bg-background shadow-soft">
                <img 
                  src={imageData.image_path} 
                  alt={imageData.image_name}
                  className="w-full max-h-96 object-contain mx-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Description */}
            {imageData.description && (
              <Card className="bg-muted/30 border-border/30">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">
                        Descrição da Imagem
                      </h3>
                      <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                        {imageData.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-border/30 text-center">
              <p className="text-sm text-muted-foreground">
                Gerado pelo <strong>Gerador de QR Code para Imagens</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}