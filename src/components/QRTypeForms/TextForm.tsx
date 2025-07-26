import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { TextContent } from '@/types/qr-types';

interface TextFormProps {
  data: TextContent;
  onChange: (data: TextContent) => void;
}

export function TextForm({ data = { text: '' }, onChange }: TextFormProps) {
  const handleChange = (value: string) => {
    onChange({ text: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="text" className="text-sm font-medium">
          Texto *
        </Label>
        <Textarea
          id="text"
          placeholder="Digite seu texto aqui..."
          value={data.text || ''}
          onChange={(e) => handleChange(e.target.value)}
          className="mt-1 min-h-[120px]"
          maxLength={1000}
        />
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-muted-foreground">
            Este texto será exibido quando o QR code for escaneado
          </p>
          <span className="text-xs text-muted-foreground">
            {(data.text || '').length}/1000
          </span>
        </div>
      </div>
    </div>
  );
}