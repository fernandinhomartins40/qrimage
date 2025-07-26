import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneContent } from '@/types/qr-types';

interface PhoneFormProps {
  data: PhoneContent;
  onChange: (data: PhoneContent) => void;
}

export function PhoneForm({ data = { phone: '' }, onChange }: PhoneFormProps) {
  const handleChange = (value: string) => {
    onChange({ phone: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="phone" className="text-sm font-medium">
          Número de Telefone *
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+5511999999999"
          value={data.phone || ''}
          onChange={(e) => handleChange(e.target.value)}
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Inclua o código do país para melhor compatibilidade
        </p>
      </div>
    </div>
  );
}