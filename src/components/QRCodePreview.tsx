import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Download, QrCode, Loader2, Copy, Eye } from 'lucide-react';
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
      title: "Download iniciado",
      description: "O QR code foi baixado com sucesso.",
    });
  };

  const copyToClipboard = async () => {
    if (!qrData?.qrData) return;

    try {
      await navigator.clipboard.writeText(qrData.qrData);
      toast({
        title: "Copiado!",
        description: "Conteúdo do QR code copiado para a área de transferência.",
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
          <head><title>Teste QR Code</title></head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Conteúdo do QR Code (${type})</h2>
            <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${qrData.qrData}</pre>
            <p><em>Este é o conteúdo que será lido quando o QR code for escaneado.</em></p>
          </body>
        </html>
      `);
    }
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <div>
            <h3 className="text-lg font-medium text-foreground">
              Gerando QR Code...
            </h3>
            <p className="text-sm text-muted-foreground">
              Por favor, aguarde enquanto processamos seus dados
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!qrData) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="p-8 rounded-full bg-muted/20 mx-auto w-fit">
            <QrCode className="h-16 w-16 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Seu QR code aparecerá aqui
            </h3>
            <p className="text-sm text-muted-foreground">
              Preencha os dados e clique em "Gerar QR Code"
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* QR Code Display */}
      <div className="flex justify-center">
        <div className="p-6 bg-background rounded-xl shadow-lg border border-border/50">
          <img 
            src={qrData.dataUrl} 
            alt="QR Code gerado" 
            className="w-64 h-64 mx-auto"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 gap-3">
        <Button
          onClick={downloadQRCode}
          className="w-full"
          size="lg"
        >
          <Download className="mr-2 h-4 w-4" />
          Baixar QR Code (PNG)
        </Button>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={copyToClipboard}
            size="sm"
          >
            <Copy className="mr-2 h-3 w-3" />
            Copiar Conteúdo
          </Button>
          
          <Button
            variant="outline"
            onClick={testQRCode}
            size="sm"
          >
            <Eye className="mr-2 h-3 w-3" />
            Testar
          </Button>
        </div>
      </div>

      {/* Info Panel */}
      <div className="p-4 bg-muted/30 rounded-lg border border-border/30">
        <h4 className="font-medium text-foreground mb-2">Informações do QR Code</h4>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium text-muted-foreground">Tipo:</span>
            <span className="ml-2 text-foreground">{type.toUpperCase()}</span>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Conteúdo:</span>
            <div className="ml-2 mt-1 font-mono text-xs bg-background p-2 rounded border break-all">
              {qrData.qrData.length > 200 
                ? `${qrData.qrData.substring(0, 200)}...` 
                : qrData.qrData
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}