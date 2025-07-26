import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { WifiContent } from '@/types/qr-types';

interface WifiFormProps {
  data: WifiContent;
  onChange: (data: WifiContent) => void;
}

export function WifiForm({ 
  data = { ssid: '', password: '', security: 'WPA', hidden: false }, 
  onChange 
}: WifiFormProps) {
  const handleChange = (field: keyof WifiContent, value: any) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="ssid" className="text-sm font-medium">
          Nome da Rede (SSID) *
        </Label>
        <Input
          id="ssid"
          type="text"
          placeholder="MinhaRede_WiFi"
          value={data.ssid || ''}
          onChange={(e) => handleChange('ssid', e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="security" className="text-sm font-medium">
          Tipo de Segurança *
        </Label>
        <Select 
          value={data.security || 'WPA'} 
          onValueChange={(value) => handleChange('security', value as WifiContent['security'])}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Selecione o tipo de segurança" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WPA">WPA/WPA2</SelectItem>
            <SelectItem value="WEP">WEP</SelectItem>
            <SelectItem value="nopass">Sem senha (Aberta)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {data.security !== 'nopass' && (
        <div>
          <Label htmlFor="password" className="text-sm font-medium">
            Senha da Rede *
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Digite a senha da rede"
            value={data.password || ''}
            onChange={(e) => handleChange('password', e.target.value)}
            className="mt-1"
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="hidden" className="text-sm font-medium">
            Rede Oculta
          </Label>
          <p className="text-xs text-muted-foreground">
            Marque se a rede não aparece na lista de redes disponíveis
          </p>
        </div>
        <Switch
          id="hidden"
          checked={data.hidden || false}
          onCheckedChange={(checked) => handleChange('hidden', checked)}
        />
      </div>
    </div>
  );
}