import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AppHeader } from '@/components/Header/AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, 
  QrCode, 
  Search, 
  Eye, 
  Download, 
  Trash2, 
  Calendar,
  FileImage,
  Link as LinkIcon,
  Copy
} from 'lucide-react';

interface QRCodeData {
  id: string;
  image_name: string;
  image_type: string;
  image_path: string;
  description: string | null;
  qr_code_url: string | null;
  qr_code_data_url: string | null;
  created_at: string;
  updated_at: string;
}

export default function MyQRCodes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredQrCodes, setFilteredQrCodes] = useState<QRCodeData[]>([]);

  useEffect(() => {
    if (user) {
      loadQRCodes();
    }
  }, [user]);

  useEffect(() => {
    // Filtrar QR codes baseado no termo de busca
    const filtered = qrCodes.filter(qr => 
      qr.image_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (qr.description && qr.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredQrCodes(filtered);
  }, [qrCodes, searchTerm]);

  const loadQRCodes = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('image_qrcodes')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setQrCodes(data || []);
    } catch (error) {
      console.error('Erro ao carregar QR codes:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus QR codes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, imageName: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${imageName}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('image_qrcodes')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setQrCodes(qrCodes.filter(qr => qr.id !== id));
      toast({
        title: "Sucesso",
        description: "QR Code excluído com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao excluir QR code:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o QR code.",
        variant: "destructive",
      });
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copiado!",
      description: "O link foi copiado para a área de transferência.",
    });
  };

  const handleDownloadQR = (dataUrl: string, fileName: string) => {
    if (!dataUrl) return;
    
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `qr-${fileName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download iniciado",
      description: "O QR code está sendo baixado.",
    });
  };

  const formatFileSize = (path: string) => {
    // Simulação de tamanho baseado no tipo de arquivo
    const extension = path.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return '~150KB';
      case 'png':
        return '~200KB';
      case 'webp':
        return '~100KB';
      default:
        return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Meus QR Codes</h1>
          <p className="text-muted-foreground">
            Gerencie todos os QR codes que você criou
          </p>
        </div>

        {/* Barra de busca */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Pesquisar por nome ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <QrCode className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-2xl font-bold">{qrCodes.length}</p>
                <p className="text-xs text-muted-foreground">Total de QR Codes</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <FileImage className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{filteredQrCodes.length}</p>
                <p className="text-xs text-muted-foreground">Resultados da busca</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Calendar className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">
                  {qrCodes.length > 0 ? new Date(qrCodes[0].created_at).toLocaleDateString('pt-BR') : '-'}
                </p>
                <p className="text-xs text-muted-foreground">Último criado</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de QR Codes */}
        {filteredQrCodes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <QrCode className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {qrCodes.length === 0 ? 'Nenhum QR Code criado' : 'Nenhum resultado encontrado'}
              </h3>
              <p className="text-muted-foreground text-center">
                {qrCodes.length === 0 
                  ? 'Comece criando seu primeiro QR code para imagens.'
                  : 'Tente ajustar sua busca ou criar um novo QR code.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQrCodes.map((qrCode) => (
              <Card key={qrCode.id} className="overflow-hidden">
                <div className="aspect-video relative bg-muted">
                  <img
                    src={qrCode.image_path}
                    alt={qrCode.image_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-xs">
                      {qrCode.image_type.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-1" title={qrCode.image_name}>
                    {qrCode.image_name}
                  </CardTitle>
                  {qrCode.description && (
                    <CardDescription className="line-clamp-2">
                      {qrCode.description}
                    </CardDescription>
                  )}
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Informações */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div>
                        <span className="font-medium">Tamanho:</span>
                        <br />
                        {formatFileSize(qrCode.image_path)}
                      </div>
                      <div>
                        <span className="font-medium">Criado:</span>
                        <br />
                        {new Date(qrCode.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    
                    {/* Ações */}
                    <div className="flex gap-2">
                      {qrCode.qr_code_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(qrCode.qr_code_url!, '_blank')}
                          className="flex-1"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Ver
                        </Button>
                      )}
                      
                      {qrCode.qr_code_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyLink(qrCode.qr_code_url!)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                      
                      {qrCode.qr_code_data_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadQR(qrCode.qr_code_data_url!, qrCode.image_name)}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(qrCode.id, qrCode.image_name)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}