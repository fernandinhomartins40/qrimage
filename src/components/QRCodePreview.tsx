import { motion } from 'framer-motion';
import { SoftButton } from '@/components/ui/soft-button';
import { ColorAccent } from '@/components/ui/color-accent';
import { AnimatedContainer } from '@/components/ui/animated-container';
import { GlowEffect, ShimmerEffect } from '@/components/ui/glow-effect';
import { FloatingElement } from '@/components/ui/floating-elements';
import { useToast } from '@/hooks/use-toast';
import { Download, QrCode, Loader2, Copy, Eye, CheckCircle } from 'lucide-react';
import { QRCodeType } from '@/types/qr-types';

interface QRCodePreviewProps {
  qrData: {
    dataUrl: string;
    content: any;
    qrData: string;
    id?: string;
  } | null;
  type: QRCodeType;
  isLoading: boolean;
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

const loadingMessages = [
  'Processando seus dados...',
  'Gerando QR Code...',
  'Aplicando configurações...',
  'Finalizando...'
];

export function QRCodePreview({ qrData, type, isLoading }: QRCodePreviewProps) {
  const { toast } = useToast();
  const currentColor = typeColors[type] || 'blue';

  const downloadQRCode = () => {
    if (!qrData?.dataUrl) return;

    const link = document.createElement('a');
    link.download = `qrcode-${type}-${Date.now()}.png`;
    link.href = qrData.dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "✅ Download iniciado",
      description: "Seu QR code foi baixado com sucesso!",
    });
  };

  const copyToClipboard = async () => {
    if (!qrData?.qrData) return;

    try {
      await navigator.clipboard.writeText(qrData.qrData);
      toast({
        title: "📋 Copiado!",
        description: "Conteúdo copiado para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar para a área de transferência.",
        variant: "destructive",
      });
    }
  };

  const testQRCode = () => {
    if (!qrData?.qrData) return;

    if (type === 'url' && qrData.qrData.startsWith('http')) {
      window.open(qrData.qrData, '_blank');
      return;
    }

    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Teste QR Code</title>
            <style>
              body { 
                font-family: system-ui, -apple-system, sans-serif; 
                padding: 2rem; 
                background: #f8fafc;
                color: #334155;
                margin: 0;
                line-height: 1.6;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 12px;
                padding: 2rem;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                border: 1px solid #e2e8f0;
              }
              pre { 
                background: #f1f5f9; 
                padding: 1rem; 
                border-radius: 8px; 
                white-space: pre-wrap;
                font-size: 0.9rem;
                border: 1px solid #e2e8f0;
              }
              h2 { color: #1e293b; margin-top: 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>🔍 Conteúdo do QR Code (${type.toUpperCase()})</h2>
              <pre>${qrData.qrData}</pre>
              <p><em>💡 Este é o conteúdo que será lido quando o QR code for escaneado.</em></p>
            </div>
          </body>
        </html>
      `);
    }
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center space-y-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <GlowEffect color={currentColor} intensity="medium">
              <ColorAccent color={currentColor} size="lg">
                <QrCode className="h-8 w-8" />
              </ColorAccent>
            </GlowEffect>
          </motion.div>
          
          <div className="space-y-3">
            <motion.h3 
              className="text-xl font-semibold text-gray-900"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Gerando seu QR Code...
            </motion.h3>
            
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
              <motion.p 
                className="text-sm text-gray-600"
                key={Math.floor(Date.now() / 2000) % loadingMessages.length}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {loadingMessages[Math.floor(Date.now() / 2000) % loadingMessages.length]}
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!qrData) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center space-y-6">
          <AnimatedContainer animation="scale" delay={0.2}>
            <ColorAccent color="gray" size="lg" soft>
              <QrCode className="h-8 w-8" />
            </ColorAccent>
          </AnimatedContainer>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">
              Seu QR Code aparecerá aqui
            </h3>
            <p className="text-gray-600">
              Preencha os dados e clique em "Gerar QR Code"
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AnimatedContainer className="space-y-6" animation="scale" delay={0.1}>
      {/* QR Code Display */}
      <div className="flex justify-center">
        <AnimatedContainer animation="bounce" delay={0.3}>
          <GlowEffect color={currentColor} intensity="medium">
            <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 relative">
              <img 
                src={qrData.dataUrl} 
                alt="QR Code gerado" 
                className="w-64 h-64 mx-auto rounded-lg"
              />
            
            {/* Success badge */}
            <AnimatedContainer 
              className="absolute -top-2 -right-2"
              animation="bounce"
              delay={0.6}
            >
              <FloatingElement intensity="subtle">
                <ColorAccent color="green" size="sm">
                  <CheckCircle className="h-3 w-3" />
                </ColorAccent>
              </FloatingElement>
            </AnimatedContainer>
            </div>
          </GlowEffect>
        </AnimatedContainer>
      </div>

      {/* Action Buttons */}
      <AnimatedContainer 
        className="space-y-4"
        animation="slide"
        direction="up"
        delay={0.4}
      >
        <SoftButton
          variant="primary"
          color={currentColor}
          onClick={downloadQRCode}
          className="w-full"
          size="lg"
        >
          <Download className="mr-2 h-4 w-4" />
          Baixar QR Code (PNG)
        </SoftButton>
        
        <div className="grid grid-cols-2 gap-3">
          <SoftButton
            variant="secondary"
            color={currentColor}
            onClick={copyToClipboard}
          >
            <Copy className="mr-2 h-3 w-3" />
            Copiar
          </SoftButton>
          
          <SoftButton
            variant="outline"
            onClick={testQRCode}
          >
            <Eye className="mr-2 h-3 w-3" />
            Testar
          </SoftButton>
        </div>
      </AnimatedContainer>

      {/* Info Panel */}
      <AnimatedContainer 
        className="p-4 bg-gray-50/50 rounded-xl border border-gray-100"
        animation="slide"
        direction="up"
        delay={0.5}
      >
        <div className="flex items-center gap-3 mb-3">
          <ShimmerEffect color={currentColor}>
            <ColorAccent color={currentColor} size="sm">
              <QrCode className="h-3 w-3" />
            </ColorAccent>
          </ShimmerEffect>
          <h4 className="font-semibold text-gray-900">
            Informações do QR Code
          </h4>
        </div>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-600">Tipo:</span>
            <span className={`px-2 py-1 bg-${currentColor}-100 text-${currentColor}-700 rounded-md text-xs font-medium`}>
              {type.toUpperCase()}
            </span>
          </div>
          
          <div>
            <span className="font-medium text-gray-600 block mb-2">Conteúdo:</span>
            <div className="bg-white p-3 rounded-lg border border-gray-200 font-mono text-xs text-gray-700 max-h-24 overflow-y-auto">
              {qrData.qrData.length > 200 
                ? `${qrData.qrData.substring(0, 200)}...` 
                : qrData.qrData
              }
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </AnimatedContainer>
  );
}