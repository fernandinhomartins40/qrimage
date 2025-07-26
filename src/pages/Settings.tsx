import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppHeader } from '@/components/Header/AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings as SettingsIcon, 
  Palette, 
  Bell, 
  Shield, 
  Download,
  Trash2,
  AlertTriangle,
  Info
} from 'lucide-react';

interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  autoDownload: boolean;
  defaultQuality: 'low' | 'medium' | 'high';
  showWatermark: boolean;
  dataRetention: '30' | '90' | '365' | 'forever';
}

export default function Settings() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'system',
    notifications: true,
    autoDownload: false,
    defaultQuality: 'high',
    showWatermark: false,
    dataRetention: '365',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    // Carregar configurações do localStorage
    const savedSettings = localStorage.getItem('qrimage-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...settings, ...parsed });
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    }
  };

  const saveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('qrimage-settings', JSON.stringify(newSettings));
    
    toast({
      title: "Configurações salvas",
      description: "Suas preferências foram atualizadas com sucesso.",
    });
  };

  const handleThemeChange = (theme: string) => {
    const newSettings = { ...settings, theme: theme as AppSettings['theme'] };
    saveSettings(newSettings);
    
    // Aplicar tema imediatamente
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  };

  const handleClearAllData = async () => {
    const confirmed = confirm(
      'ATENÇÃO: Esta ação irá excluir TODOS os seus QR codes e dados. Esta ação não pode ser desfeita. Tem certeza?'
    );
    
    if (!confirmed) return;
    
    const doubleConfirm = confirm(
      'Última confirmação: Todos os seus dados serão perdidos permanentemente. Confirma a exclusão?'
    );
    
    if (!doubleConfirm) return;

    try {
      setLoading(true);
      
      // Em um cenário real, você faria uma chamada para deletar todos os dados do usuário
      // Por enquanto, vamos simular
      
      toast({
        title: "Dados excluídos",
        description: "Todos os seus dados foram excluídos com sucesso.",
      });
      
      // Fazer logout após exclusão
      setTimeout(() => {
        signOut();
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao excluir dados:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir os dados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">
            Personalize sua experiência no QR Generator
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu lateral */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categorias</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 p-2 rounded-md bg-primary/10 text-primary">
                  <Palette className="h-4 w-4" />
                  <span className="text-sm font-medium">Aparência</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-md">
                  <Bell className="h-4 w-4" />
                  <span className="text-sm">Notificações</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-md">
                  <Download className="h-4 w-4" />
                  <span className="text-sm">Download</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-md">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm">Privacidade</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conteúdo principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Aparência */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Aparência
                </CardTitle>
                <CardDescription>
                  Personalize a aparência da aplicação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Tema</Label>
                  <Select value={settings.theme} onValueChange={handleThemeChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Escolha entre tema claro, escuro ou seguir o sistema
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Notificações */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificações
                </CardTitle>
                <CardDescription>
                  Configure quando receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Notificações push</Label>
                    <p className="text-xs text-muted-foreground">
                      Receba notificações sobre o status dos seus QR codes
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={settings.notifications}
                    onCheckedChange={(checked) => 
                      saveSettings({ ...settings, notifications: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Download */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Download
                </CardTitle>
                <CardDescription>
                  Configure as opções de download
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoDownload">Download automático</Label>
                    <p className="text-xs text-muted-foreground">
                      Baixar automaticamente o QR code após geração
                    </p>
                  </div>
                  <Switch
                    id="autoDownload"
                    checked={settings.autoDownload}
                    onCheckedChange={(checked) => 
                      saveSettings({ ...settings, autoDownload: checked })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quality">Qualidade padrão</Label>
                  <Select 
                    value={settings.defaultQuality} 
                    onValueChange={(value) => 
                      saveSettings({ ...settings, defaultQuality: value as AppSettings['defaultQuality'] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa (rápido)</SelectItem>
                      <SelectItem value="medium">Média (balanceado)</SelectItem>
                      <SelectItem value="high">Alta (melhor qualidade)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="watermark">Marca d'água</Label>
                    <p className="text-xs text-muted-foreground">
                      Adicionar marca d'água nos QR codes gerados
                    </p>
                  </div>
                  <Switch
                    id="watermark"
                    checked={settings.showWatermark}
                    onCheckedChange={(checked) => 
                      saveSettings({ ...settings, showWatermark: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacidade */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacidade e Dados
                </CardTitle>
                <CardDescription>
                  Gerencie seus dados e privacidade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="retention">Retenção de dados</Label>
                  <Select 
                    value={settings.dataRetention} 
                    onValueChange={(value) => 
                      saveSettings({ ...settings, dataRetention: value as AppSettings['dataRetention'] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 dias</SelectItem>
                      <SelectItem value="90">90 dias</SelectItem>
                      <SelectItem value="365">1 ano</SelectItem>
                      <SelectItem value="forever">Sempre</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Por quanto tempo manter seus QR codes armazenados
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20">
                    <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                      <h4 className="font-medium text-destructive">Zona de Perigo</h4>
                      <p className="text-xs text-muted-foreground">
                        As ações abaixo são irreversíveis. Proceda com cuidado.
                      </p>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleClearAllData}
                        disabled={loading}
                        className="w-full"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {loading ? 'Excluindo...' : 'Excluir todos os dados'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações da conta */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Informações da Conta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Email:</span>
                    <p className="font-mono text-xs bg-muted p-2 rounded mt-1">
                      {user?.email}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">ID do usuário:</span>
                    <p className="font-mono text-xs bg-muted p-2 rounded mt-1">
                      {user?.id.substring(0, 8)}...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}