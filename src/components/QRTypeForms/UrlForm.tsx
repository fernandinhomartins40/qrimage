import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UrlContent } from '@/types/qr-types';

interface UrlFormProps {
  data: UrlContent;
  onChange: (data: UrlContent) => void;
}

export function UrlForm({ data = { url: '', title: '' }, onChange }: UrlFormProps) {
  const handleChange = (field: keyof UrlContent, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="url" className="text-sm font-medium">
          URL / Link *
        </Label>
        <Input
          id="url"
          type="url"
          placeholder="https://exemplo.com"
          value={data.url || ''}
          onChange={(e) => handleChange('url', e.target.value)}
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Será redirecionado para esta URL quando o QR code for escaneado
        </p>
      </div>

      <div>
        <Label htmlFor="title" className="text-sm font-medium">
          Título (opcional)
        </Label>
        <Input
          id="title"
          type="text"
          placeholder="Nome do link"
          value={data.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Usado apenas para identificação interna
        </p>
      </div>
    </div>
  );
}