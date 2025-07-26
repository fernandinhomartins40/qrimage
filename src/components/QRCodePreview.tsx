import { motion } from 'framer-motion';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { FloatingIcon } from '@/components/ui/floating-icon';
import { useToast } from '@/hooks/use-toast';
import { Download, QrCode, Loader2, Copy, Eye, Sparkles } from 'lucide-react';
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

const loadingMessages = [
  'Processando seus dados...',
  'Gerando QR Code...',
  'Aplicando configurações...',
  'Finalizando...'
];

export function QRCodePreview({ qrData, type, isLoading }: QRCodePreviewProps) {
  const { toast } = useToast();

  const downloadQRCode = () => {
    if (!qrData?.dataUrl) return;

    const link = document.createElement('a');
    link.download = `qrcode-${type}-${Date.now()}.png`;
    link.href = qrData.dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "📥 Download iniciado",
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

    // For URLs, open directly
    if (type === 'url' && qrData.qrData.startsWith('http')) {
      window.open(qrData.qrData, '_blank');
      return;
    }

    // For other types, show in a modal or new window
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
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                margin: 0;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background: rgba(255,255,255,0.1);
                backdrop-filter: blur(10px);
                border-radius: 1rem;
                padding: 2rem;
                border: 1px solid rgba(255,255,255,0.2);
              }
              pre { 
                background: rgba(0,0,0,0.3); 
                padding: 1rem; 
                border-radius: 0.5rem; 
                white-space: pre-wrap;
                font-size: 0.9rem;
                line-height: 1.4;
              }
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
            <FloatingIcon
              color="bg-gradient-to-br from-blue-500 to-purple-600"
              size="lg"
            >
              <QrCode className="h-8 w-8" />
            </FloatingIcon>
          </motion.div>
          
          <div className="space-y-2">
            <motion.h3 
              className="text-xl font-bold text-slate-800 dark:text-white"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Gerando seu QR Code...
            </motion.h3>
            
            <motion.div 
              className="flex items-center justify-center gap-2"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              <motion.p 
                className="text-sm text-slate-600 dark:text-slate-400"
                key={Math.floor(Date.now() / 2000) % loadingMessages.length}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {loadingMessages[Math.floor(Date.now() / 2000) % loadingMessages.length]}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (!qrData) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <FloatingIcon
                color="bg-gradient-to-br from-slate-300 to-slate-400"
                size="lg"
                glow={false}
              >
                <QrCode className="h-8 w-8" />
              </FloatingIcon>
              
              {/* Floating particles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                  animate={{
                    x: [0, 20, -20, 0],
                    y: [0, -30, -10, 0],
                    opacity: [0, 1, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5
                  }}
                  style={{
                    left: `${50 + i * 10}%`,
                    top: `${30 + i * 5}%`
                  }}
                />
              ))}
            </div>
          </motion.div>
          
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
              ✨ Seu QR Code aparecerá aqui
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Preencha os dados e clique em "Gerar QR Code"
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* QR Code Display */}
      <div className="flex justify-center">
        <motion.div 
          className="relative"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 20,
            duration: 0.8
          }}
        >
          <div className="p-6 bg-white rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-50" />
            
            <div className="relative z-10">
              <img 
                src={qrData.dataUrl} 
                alt="QR Code gerado" 
                className="w-64 h-64 mx-auto rounded-lg"
              />
            </div>
            
            {/* Success indicator */}
            <motion.div 
              className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
            >
              <Sparkles className="h-4 w-4 text-white" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <ShimmerButton
          variant="gradient"
          onClick={downloadQRCode}
          className="w-full"
        >
          <Download className="mr-2 h-4 w-4" />
          Baixar QR Code (PNG)
        </ShimmerButton>
        
        <div className="grid grid-cols-2 gap-3">
          <ShimmerButton
            variant="glow"
            onClick={copyToClipboard}
          >
            <Copy className="mr-2 h-3 w-3" />
            Copiar
          </ShimmerButton>
          
          <ShimmerButton
            variant="default"
            onClick={testQRCode}
          >
            <Eye className="mr-2 h-3 w-3" />
            Testar
          </ShimmerButton>
        </div>
      </motion.div>

      {/* Info Panel */}
      <motion.div 
        className="p-4 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 rounded-xl border border-slate-200 dark:border-slate-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h4 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
          <FloatingIcon
            color="bg-gradient-to-br from-blue-500 to-purple-600"
            size="sm"
          >
            <QrCode className="h-3 w-3" />
          </FloatingIcon>
          Informações do QR Code
        </h4>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-600 dark:text-slate-400">Tipo:</span>
            <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-xs font-medium">
              {type.toUpperCase()}
            </span>
          </div>
          
          <div>
            <span className="font-medium text-slate-600 dark:text-slate-400 block mb-2">Conteúdo:</span>
            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-xs break-all max-h-24 overflow-y-auto">
              {qrData.qrData.length > 200 
                ? `${qrData.qrData.substring(0, 200)}...` 
                : qrData.qrData
              }
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}