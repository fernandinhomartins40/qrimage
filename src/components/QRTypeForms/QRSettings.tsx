import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Palette } from 'lucide-react';

interface QRSettingsProps {
  settings: {
    color: string;
    backgroundColor: string;
    size: number;
    margin: number;
  };
  onChange: (settings: any) => void;
}

const predefinedColors = [
  { name: 'Preto', value: '#000000' },
  { name: 'Azul', value: '#3B82F6' },
  { name: 'Verde', value: '#10B981' },
  { name: 'Vermelho', value: '#EF4444' },
  { name: 'Roxo', value: '#8B5CF6' },
  { name: 'Laranja', value: '#F59E0B' },
];

const predefinedBackgrounds = [
  { name: 'Branco', value: '#FFFFFF' },
  { name: 'Cinza Claro', value: '#F3F4F6' },
  { name: 'Azul Claro', value: '#EFF6FF' },
  { name: 'Verde Claro', value: '#F0FDF4' },
  { name: 'Rosa Claro', value: '#FDF2F8' },
  { name: 'Amarelo Claro', value: '#FEFCE8' },
];

export function QRSettings({ settings, onChange }: QRSettingsProps) {
  const handleChange = (field: string, value: any) => {
    onChange({
      ...settings,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <Separator />
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-primary" />
          <h3 className="text-lg font-medium">Personalização Visual</h3>
        </div>

        {/* Cor do QR Code */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Cor do QR Code</Label>
          <div className="grid grid-cols-3 gap-2">
            {predefinedColors.map((color) => (
              <button
                key={color.value}
                onClick={() => handleChange('color', color.value)}
                className={`
                  flex items-center gap-2 p-2 rounded-lg border-2 text-xs transition-all
                  ${settings.color === color.value 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-border/60'
                  }
                `}
                title={color.name}
              >
                <div 
                  className="w-4 h-4 rounded border border-border/30"
                  style={{ backgroundColor: color.value }}
                />
                {color.name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={settings.color}
              onChange={(e) => handleChange('color', e.target.value)}
              className="w-12 h-8 rounded border border-border cursor-pointer"
            />
            <span className="text-xs text-muted-foreground font-mono">
              {settings.color}
            </span>
          </div>
        </div>

        {/* Cor de Fundo */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Cor de Fundo</Label>
          <div className="grid grid-cols-3 gap-2">
            {predefinedBackgrounds.map((bg) => (
              <button
                key={bg.value}
                onClick={() => handleChange('backgroundColor', bg.value)}
                className={`
                  flex items-center gap-2 p-2 rounded-lg border-2 text-xs transition-all
                  ${settings.backgroundColor === bg.value 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-border/60'
                  }
                `}
                title={bg.name}
              >
                <div 
                  className="w-4 h-4 rounded border border-border/30"
                  style={{ backgroundColor: bg.value }}
                />
                {bg.name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={settings.backgroundColor}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              className="w-12 h-8 rounded border border-border cursor-pointer"
            />
            <span className="text-xs text-muted-foreground font-mono">
              {settings.backgroundColor}
            </span>
          </div>
        </div>

        {/* Tamanho */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Tamanho: {settings.size}px
          </Label>
          <Slider
            value={[settings.size]}
            onValueChange={([value]) => handleChange('size', value)}
            min={128}
            max={512}
            step={32}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>128px</span>
            <span>512px</span>
          </div>
        </div>

        {/* Margem */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Margem: {settings.margin} módulos
          </Label>
          <Slider
            value={[settings.margin]}
            onValueChange={([value]) => handleChange('margin', value)}
            min={1}
            max={8}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 módulo</span>
            <span>8 módulos</span>
          </div>
        </div>

        {/* Preview */}
        <div className="mt-4 p-4 bg-muted/20 rounded-lg">
          <Label className="text-sm font-medium mb-2 block">Preview das Cores</Label>
          <div className="flex items-center justify-center">
            <div 
              className="w-16 h-16 rounded border-2 flex items-center justify-center"
              style={{ 
                backgroundColor: settings.backgroundColor,
                borderColor: settings.color 
              }}
            >
              <div 
                className="w-8 h-8 rounded-sm"
                style={{ backgroundColor: settings.color }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}