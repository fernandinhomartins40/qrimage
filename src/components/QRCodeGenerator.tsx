import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedCard, AnimatedCardContent, AnimatedCardHeader } from '@/components/ui/animated-card';
import { GradientText } from '@/components/ui/gradient-text';
import { FloatingIcon } from '@/components/ui/floating-icon';
import { ShimmerButton } from '@/components/ui/shimmer-button';
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
  url: 'from-blue-500 to-cyan-500',
  text: 'from-gray-500 to-slate-600',
  wifi: 'from-emerald-500 to-teal-500',
  vcard: 'from-purple-500 to-violet-500',
  sms: 'from-amber-500 to-orange-500',
  whatsapp: 'from-green-500 to-emerald-500',
  email: 'from-red-500 to-pink-500',
  phone: 'from-indigo-500 to-blue-500',
  location: 'from-rose-500 to-pink-500',
  event: 'from-violet-500 to-purple-500',
  pix: 'from-yellow-500 to-amber-500'
};

const typeIcons = {
  url: '🔗',
  text: '📝',
  wifi: '📶',
  vcard: '👤',
  sms: '💬',
  whatsapp: '📱',
  email: '✉️',
  phone: '☎️',
  location: '📍',
  event: '📅',
  pix: '💰'
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
        title: "🎉 QR Code gerado com sucesso!",
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

  const currentGradient = typeColors[qrType] || 'from-blue-500 to-purple-500';
  const currentIcon = typeIcons[qrType] || '🔗';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-red-600/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 py-8">
          <div className="max-w-7xl mx-auto px-4 space-y-8">
            {/* Header */}
            <motion.div 
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4">
                <FloatingIcon
                  color={`bg-gradient-to-br ${currentGradient}`}
                  size="lg"
                >
                  <span className="text-2xl">{currentIcon}</span>
                </FloatingIcon>
                
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold text-slate-800 dark:text-white">
                    Gerador de{' '}
                    <GradientText 
                      gradient={currentGradient}
                      className="text-2xl md:text-4xl"
                    >
                      {getTypeTitle(qrType)}
                    </GradientText>
                  </h1>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">
                    Preencha os dados abaixo para criar seu QR Code personalizado
                  </p>
                </div>
              </div>
              
              {onTypeChange && (
                <Button 
                  variant="outline" 
                  onClick={onTypeChange}
                  className="bg-white/80 backdrop-blur-sm hover:bg-white"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Trocar Tipo
                </Button>
              )}
            </motion.div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Form Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <AnimatedCard 
                  className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
                  glow={false}
                >
                  <AnimatedCardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <FloatingIcon
                        color="bg-gradient-to-br from-slate-600 to-slate-700"
                        size="sm"
                      >
                        <Settings className="h-4 w-4" />
                      </FloatingIcon>
                      <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                          Configuração
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Customize seu QR Code
                        </p>
                      </div>
                    </div>
                  </AnimatedCardHeader>
                  
                  <AnimatedCardContent className="space-y-6">
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
                      <ShimmerButton
                        variant="gradient"
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
                      </ShimmerButton>
                      
                      {generatedQR && (
                        <Button
                          variant="outline"
                          onClick={handleReset}
                          className="bg-white/80 backdrop-blur-sm hover:bg-white"
                        >
                          Novo QR Code
                        </Button>
                      )}
                    </div>
                  </AnimatedCardContent>
                </AnimatedCard>
              </motion.div>

              {/* Preview Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <AnimatedCard 
                  className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
                  glow={!!generatedQR}
                >
                  <AnimatedCardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <FloatingIcon
                        color={`bg-gradient-to-br ${currentGradient}`}
                        size="sm"
                      >
                        <Eye className="h-4 w-4" />
                      </FloatingIcon>
                      <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                          Visualização
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Preview do seu QR Code
                        </p>
                      </div>
                    </div>
                  </AnimatedCardHeader>
                  
                  <AnimatedCardContent>
                    <QRCodePreview
                      qrData={generatedQR}
                      type={qrType}
                      isLoading={isGenerating}
                    />
                  </AnimatedCardContent>
                </AnimatedCard>
              </motion.div>
            </div>

            {/* Success Animation */}
            {generatedQR && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center"
              >
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                  <Sparkles className="h-5 w-5" />
                  <span className="font-semibold">QR Code criado com sucesso!</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}