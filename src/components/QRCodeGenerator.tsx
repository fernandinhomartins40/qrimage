import { useState } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ImageUpload } from './ImageUpload';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Download, Loader2, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ImageData {
  id?: string;
  file: File;
  preview: string;
  description: string;
  qrCodeUrl?: string;
  qrCodeDataUrl?: string;
}

const backgroundColors = [
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Verde', value: '#10b981' },
  { name: 'Roxo', value: '#8b5cf6' },
  { name: 'Rosa', value: '#ec4899' },
  { name: 'Amarelo', value: '#f59e0b' },
  { name: 'Vermelho', value: '#ef4444' },
  { name: 'Cinza', value: '#6b7280' },
  { name: 'Preto', value: '#000000' },
];

export function QRCodeGenerator() {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewOnlyMode, setViewOnlyMode] = useState(false);
  const [selectedColor, setSelectedColor] = useState(backgroundColors[0].value);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleImageSelect = (file: File, preview: string) => {
    setImageData({
      file,
      preview,
      description: description,
    });
  };

  const handleRemoveImage = () => {
    setImageData(null);
    setDescription('');
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    if (imageData) {
      setImageData({
        ...imageData,
        description: value,
      });
    }
  };

  const generateQRCode = async () => {
    if (!imageData) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma imagem primeiro.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Upload da imagem para o Supabase Storage
      const timestamp = Date.now();
      const fileExtension = imageData.file.name.split('.').pop();
      const fileName = `${timestamp}.${fileExtension}`;
      const filePath = `images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, imageData.file);

      if (uploadError) {
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

      // Gerar a URL pública da imagem
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      // Criar URL para a página de visualização
      const baseUrl = `${window.location.origin}/view/${timestamp}`;
      const urlParams = new URLSearchParams();
      
      if (viewOnlyMode) {
        urlParams.append('mode', 'view-only');
        urlParams.append('bg', selectedColor.replace('#', ''));
      }
      
      const pageUrl = urlParams.toString() ? `${baseUrl}?${urlParams.toString()}` : baseUrl;

      // Gerar o QR code
      const qrCodeDataUrl = await QRCode.toDataURL(pageUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      // Salvar os dados no banco de dados
      const { data: insertData, error: insertError } = await supabase
        .from('image_qrcodes')
        .insert({
          user_id: user?.id || null,
          image_name: imageData.file.name,
          image_type: imageData.file.type,
          image_path: publicUrl,
          description: description,
          qr_code_url: pageUrl,
          qr_code_data_url: qrCodeDataUrl,
        })
        .select()
        .single();

      if (insertError) {
        throw new Error(`Erro ao salvar dados: ${insertError.message}`);
      }

      setImageData({
        ...imageData,
        id: insertData.id,
        description: description,
        qrCodeUrl: pageUrl,
        qrCodeDataUrl: qrCodeDataUrl,
      });

      toast({
        title: "QR Code gerado com sucesso!",
        description: "Seus dados foram salvos e o QR code está pronto para download.",
        variant: "default",
      });

    } catch (error) {
      console.error('Erro ao gerar QR code:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao gerar QR code. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!imageData?.qrCodeDataUrl) return;

    const link = document.createElement('a');
    link.download = `qrcode-${imageData.file.name.split('.')[0]}.png`;
    link.href = imageData.qrCodeDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download iniciado",
      description: "O QR code foi baixado com sucesso.",
      variant: "default",
    });
  };

  return (
    <div className="bg-gradient-subtle p-4 pt-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Gerador de QR Code
            <span className="block text-2xl md:text-3xl text-primary font-normal mt-2">
              para Imagens
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Crie QR codes únicos para suas imagens e compartilhe facilmente
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Creation Section */}
          <Card className="bg-gradient-card backdrop-blur-sm border-border/50 shadow-soft">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <img 
                    src="/logo_ultrabase.png" 
                    alt="UltraBase Logo" 
                    className="h-5 w-5 object-contain" 
                  />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">Criação</h2>
              </div>

              {/* Image Upload */}
              <ImageUpload
                onImageSelect={handleImageSelect}
                selectedImage={imageData}
                onRemoveImage={handleRemoveImage}
              />

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Descrição da Imagem
                </label>
                <Textarea
                  placeholder="Descreva sua imagem em até 300 caracteres..."
                  value={description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  maxLength={300}
                  className="min-h-[100px] resize-none bg-background/50 border-border/50 focus:border-primary/50"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {description.length}/300 caracteres
                </p>
              </div>

              {/* View Only Mode Toggle */}
              <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-border/30">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Palette className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="view-only-mode" className="text-sm font-medium text-foreground">
                      Modo somente visualização
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Exibe apenas a imagem com fundo colorido, sem descrição
                    </p>
                  </div>
                  <Switch
                    id="view-only-mode"
                    checked={viewOnlyMode}
                    onCheckedChange={setViewOnlyMode}
                  />
                </div>

                {/* Color Selector */}
                {viewOnlyMode && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground">
                      Cor de fundo
                    </Label>
                    <div className="grid grid-cols-4 gap-2">
                      {backgroundColors.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setSelectedColor(color.value)}
                          className={`
                            w-full h-10 rounded-lg border-2 transition-all hover:scale-105
                            ${selectedColor === color.value 
                              ? 'border-foreground ring-2 ring-primary/20' 
                              : 'border-border/50 hover:border-border'
                            }
                          `}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Cor selecionada: {backgroundColors.find(c => c.value === selectedColor)?.name}
                    </p>
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <Button
                variant="hero"
                size="xl"
                onClick={generateQRCode}
                disabled={!imageData || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Gerando QR Code...
                  </>
                ) : (
                  <>
                    <img 
                      src="/logo_ultrabase.png" 
                      alt="UltraBase Logo" 
                      className="mr-2 h-5 w-5 object-contain" 
                    />
                    Gerar QR Code
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* QR Code Visualization Section */}
          <Card className="bg-gradient-card backdrop-blur-sm border-border/50 shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Download className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">Visualização do QR Code</h2>
              </div>

              {imageData?.qrCodeDataUrl ? (
                <div className="space-y-6">
                  {/* QR Code Display */}
                  <div className="flex justify-center">
                    <div className="p-6 bg-background rounded-xl shadow-soft border border-border/50">
                      <img 
                        src={imageData.qrCodeDataUrl} 
                        alt="QR Code gerado" 
                        className="w-64 h-64 mx-auto"
                      />
                    </div>
                  </div>

                  {/* Download Button */}
                  <Button
                    variant="success"
                    size="lg"
                    onClick={downloadQRCode}
                    className="w-full"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Baixar QR Code (PNG)
                  </Button>

                  {/* Info */}
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/30">
                    <p className="text-sm text-muted-foreground text-center">
                      <strong>URL gerada:</strong><br />
                      <span className="font-mono text-xs break-all">{imageData.qrCodeUrl}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="p-8 rounded-full bg-muted/20 mx-auto w-fit">
                      <img 
                        src="/logo_ultrabase.png" 
                        alt="UltraBase Logo" 
                        className="h-16 w-16 object-contain opacity-50" 
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Seu QR code aparecerá aqui
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Envie uma imagem e clique em "Gerar QR Code"
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}