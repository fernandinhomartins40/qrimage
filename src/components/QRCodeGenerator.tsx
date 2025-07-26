import { useState } from 'react';
import { motion } from 'framer-motion';
import { SoftCard, SoftCardContent, SoftCardHeader } from '@/components/ui/soft-card';
import { ColorAccent } from '@/components/ui/color-accent';
import { SoftButton } from '@/components/ui/soft-button';
import { AnimatedContainer } from '@/components/ui/animated-container';
import { GlowEffect, ShimmerEffect } from '@/components/ui/glow-effect';
import { FloatingElement, ParticleField } from '@/components/ui/floating-elements';
import { Button } from '@/components/ui/button';
import { QRTypeForm } from './QRTypeForms/QRTypeForm';
import { QRCodePreview } from './QRCodePreview';
import { QRCodeType } from '@/types/qr-types';
import { generateQRData, generateQRImage, validateQRContent } from '@/utils/qr-generators';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  QrCode, 
  Loader2, 
  ArrowLeft, 
  Settings, 
  Eye,
  Sparkles,
  Zap
} from 'lucide-react';

interface QRCodeGeneratorProps {
  qrType: QRCodeType;
  onTypeChange?: () => void;
}

const typeColors = {
  url: 'blue',
  text: 'gray',
  wifi: 'teal',
  vcard: 'purple',
  sms: 'orange',
  whatsapp: 'green',
  email: 'red',
  phone: 'indigo',
  location: 'rose',
  event: 'purple',
  pix: 'yellow'
};

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
      const qrData = generateQRData(qrType, formData);
      const qrDataUrl = await generateQRImage(qrData, qrSettings);

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

      const { data: insertData, error: insertError } = await supabase
        .from('image_qrcodes')
        .insert({
          user_id: user?.id || null,
          image_name: displayName,
          image_type: 'qr_code',
          image_path: qrDataUrl,
          description: `QR Code do tipo ${getTypeTitle(qrType)}`,
          qr_code_url: qrData,
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
        title: "✅ QR Code gerado com sucesso!",
        description: `Seu QR Code ${getTypeTitle(qrType)} está pronto para download.`,
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

  const currentColor = typeColors[qrType] || 'blue';

  return (
    <div className="min-h-screen bg-slate-50/50 relative overflow-hidden">
      <ParticleField className="opacity-30" particleCount={6} colors={['blue', 'purple', 'teal']} />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 relative z-10">
        {/* Header */}
        <AnimatedContainer 
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          animation="slide"
          direction="up"
          delay={0.1}
        >
          <div className="flex items-center gap-4">
            <FloatingElement intensity="subtle" delay={0.5}>
              <GlowEffect color={currentColor} intensity="medium">
                <ColorAccent color={currentColor} size="lg">
                  <QrCode className="h-6 w-6" />
                </ColorAccent>
              </GlowEffect>
            </FloatingElement>
            
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Gerador de <span className={`text-${currentColor}-600`}>{getTypeTitle(qrType)}</span>
              </h1>
              <p className="text-gray-600 mt-1">
                Preencha os dados abaixo para criar seu QR Code personalizado
              </p>
            </div>
          </div>
          
          {onTypeChange && (
            <Button 
              variant="outline" 
              onClick={onTypeChange}
              className="bg-white hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Trocar Tipo
            </Button>
          )}
        </AnimatedContainer>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <AnimatedContainer
            animation="slide"
            direction="left"
            delay={0.2}
          >
            <GlowEffect color={currentColor} intensity="subtle">
              <SoftCard className="h-full">
                <SoftCardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <ShimmerEffect color="gray">
                      <ColorAccent color="gray" size="sm">
                        <Settings className="h-4 w-4" />
                      </ColorAccent>
                    </ShimmerEffect>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Configuração
                    </h2>
                    <p className="text-sm text-gray-600">
                      Customize seu QR Code
                    </p>
                  </div>
                </div>
              </SoftCardHeader>
              
              <SoftCardContent className="space-y-6">
                {/* Type-specific form */}
                <QRTypeForm
                  type={qrType}
                  data={formData}
                  onChange={handleFormDataChange}
                  settings={qrSettings}
                  onSettingsChange={handleSettingsChange}
                />

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <SoftButton
                    variant="primary"
                    color={currentColor}
                    onClick={generateQRCode}
                    disabled={isGenerating}
                    className="flex-1"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Gerar QR Code
                      </>
                    )}
                  </SoftButton>
                  
                  {generatedQR && (
                    <SoftButton
                      variant="outline"
                      onClick={handleReset}
                    >
                      Novo QR Code
                    </SoftButton>
                  )}
                </div>
              </SoftCardContent>
              </SoftCard>
            </GlowEffect>
          </AnimatedContainer>

          {/* Preview Section */}
          <AnimatedContainer
            animation="slide"
            direction="right"
            delay={0.4}
          >
            <GlowEffect color={currentColor} intensity="subtle">
              <SoftCard className="h-full">
                <SoftCardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <ShimmerEffect color={currentColor}>
                      <ColorAccent color={currentColor} size="sm">
                        <Eye className="h-4 w-4" />
                      </ColorAccent>
                    </ShimmerEffect>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Visualização
                    </h2>
                    <p className="text-sm text-gray-600">
                      Preview do seu QR Code
                    </p>
                  </div>
                </div>
              </SoftCardHeader>
              
              <SoftCardContent>
                <QRCodePreview
                  qrData={generatedQR}
                  type={qrType}
                  isLoading={isGenerating}
                />
              </SoftCardContent>
              </SoftCard>
            </GlowEffect>
          </AnimatedContainer>
        </div>

        {/* Success Message */}
        {generatedQR && (
          <AnimatedContainer
            animation="bounce"
            delay={0.6}
            className="text-center"
          >
            <GlowEffect color="green" intensity="medium">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white shadow-sm border border-green-200">
                <FloatingElement intensity="medium">
                  <ColorAccent color="green" size="sm">
                    <Sparkles className="h-3 w-3" />
                  </ColorAccent>
                </FloatingElement>
                <span className="font-semibold text-green-700">
                  QR Code criado com sucesso!
                </span>
              </div>
            </GlowEffect>
          </AnimatedContainer>
        )}
      </div>
    </div>
  );
}