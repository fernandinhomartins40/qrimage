import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QRTypeForm } from './QRTypeForms/QRTypeForm';
import { QRCodePreview } from './QRCodePreview';
import { QRCodeType } from '@/types/qr-types';
import { generateQRData, generateQRImage, validateQRContent } from '@/utils/qr-generators';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { QrCode, Loader2, ArrowLeft } from 'lucide-react';

interface QRCodeGeneratorProps {
  qrType: QRCodeType;
  onTypeChange?: () => void;
}

export function QRCodeGenerator({ qrType, onTypeChange }: QRCodeGeneratorProps) {
  const [formData, setFormData] = useState<any>({});
  const [qrSettings, setQrSettings] = useState({
    color: '#000000',
    backgroundColor: '#FFFFFF',
    size: 256,
    margin: 4
  });
  const [generatedQR, setGeneratedQR] = useState<{
    dataUrl: string;
    content: any;
    qrData: string;
    id?: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const getTypeTitle = (type: QRCodeType): string => {
    const titles = {
      url: 'Link/URL',
      text: 'Texto',
      wifi: 'WiFi',
      vcard: 'Cartão de Visita',
      sms: 'SMS',
      whatsapp: 'WhatsApp',
      email: 'Email',
      phone: 'Telefone',
      location: 'Localização',
      event: 'Evento',
      pix: 'PIX'
    };
    return titles[type] || type;
  };

  const handleFormDataChange = (data: any) => {
    setFormData(data);
  };

  const handleSettingsChange = (settings: any) => {
    setQrSettings({ ...qrSettings, ...settings });
  };

  const generateQRCode = async () => {
    // Validate form data
    const validation = validateQRContent(qrType, formData);
    if (!validation.isValid) {
      toast({
        title: "Dados inválidos",
        description: validation.errors.join(', '),
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Generate QR data string
      const qrData = generateQRData(qrType, formData);
      
      // Generate QR image
      const qrDataUrl = await generateQRImage(qrData, qrSettings);

      // Create a display name for the QR code
      const getDisplayName = () => {
        switch (qrType) {
          case 'url':
            return formData.title || formData.url || 'Link QR Code';
          case 'text':
            return formData.text?.substring(0, 50) + (formData.text?.length > 50 ? '...' : '') || 'Texto QR Code';
          case 'wifi':
            return `WiFi: ${formData.ssid}`;
          case 'vcard':
            return `${formData.firstName} ${formData.lastName}`;
          case 'whatsapp':
            return `WhatsApp: ${formData.phone}`;
          case 'email':
            return `Email: ${formData.email}`;
          case 'sms':
            return `SMS: ${formData.phone}`;
          case 'phone':
            return `Tel: ${formData.phone}`;
          case 'location':
            return formData.name || `Local: ${formData.latitude}, ${formData.longitude}`;
          case 'event':
            return formData.title || 'Evento';
          case 'pix':
            return `PIX: ${formData.name}`;
          default:
            return 'QR Code';
        }
      };

      const displayName = getDisplayName();

      // Save to database
      const { data: insertData, error: insertError } = await supabase
        .from('image_qrcodes')
        .insert({
          user_id: user?.id || null,
          image_name: displayName,
          image_type: 'qr_code',
          image_path: qrDataUrl, // For now, store the data URL
          description: `QR Code do tipo ${getTypeTitle(qrType)}`,
          qr_code_url: qrData, // Store the actual QR data
          qr_code_data_url: qrDataUrl,
          qr_type: qrType,
          content: formData,
          settings: qrSettings,
          is_active: true,
          scan_count: 0
        })
        .select()
        .single();

      if (insertError) {
        throw new Error(`Erro ao salvar: ${insertError.message}`);
      }

      setGeneratedQR({
        dataUrl: qrDataUrl,
        content: formData,
        qrData: qrData,
        id: insertData.id
      });

      toast({
        title: "QR Code gerado com sucesso!",
        description: `Seu QR Code ${getTypeTitle(qrType)} está pronto.`,
      });

    } catch (error) {
      console.error('Erro ao gerar QR code:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao gerar QR code.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setFormData({});
    setGeneratedQR(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <QrCode className="h-8 w-8 text-primary" />
            Gerador de QR Code - {getTypeTitle(qrType)}
          </h1>
          <p className="text-muted-foreground mt-2">
            Preencha os dados abaixo para gerar seu QR Code
          </p>
        </div>
        {onTypeChange && (
          <Button variant="outline" onClick={onTypeChange}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Trocar Tipo
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle>Configuração do QR Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Type-specific form */}
            <QRTypeForm
              type={qrType}
              data={formData}
              onChange={handleFormDataChange}
              settings={qrSettings}
              onSettingsChange={handleSettingsChange}
            />

            {/* Generate Button */}
            <div className="flex gap-3">
              <Button
                onClick={generateQRCode}
                disabled={isGenerating}
                className="flex-1"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <QrCode className="mr-2 h-4 w-4" />
                    Gerar QR Code
                  </>
                )}
              </Button>
              
              {generatedQR && (
                <Button
                  variant="outline"
                  onClick={handleReset}
                  size="lg"
                >
                  Novo QR Code
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle>Visualização</CardTitle>
          </CardHeader>
          <CardContent>
            <QRCodePreview
              qrData={generatedQR}
              type={qrType}
              isLoading={isGenerating}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}