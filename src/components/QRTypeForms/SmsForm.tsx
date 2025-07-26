import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SmsContent } from '@/types/qr-types';

interface SmsFormProps {
  data: SmsContent;
  onChange: (data: SmsContent) => void;
}

export function SmsForm({ data = { phone: '', message: '' }, onChange }: SmsFormProps) {
  const handleChange = (field: keyof SmsContent, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
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
          onChange={(e) => handleChange('phone', e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="message" className="text-sm font-medium">
          Mensagem *
        </Label>
        <Textarea
          id="message"
          placeholder="Sua mensagem aqui..."
          value={data.message || ''}
          onChange={(e) => handleChange('message', e.target.value)}
          className="mt-1 min-h-[100px]"
          maxLength={160}
        />
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-muted-foreground">
            Mensagem pré-preenchida no SMS
          </p>
          <span className="text-xs text-muted-foreground">
            {(data.message || '').length}/160
          </span>
        </div>
      </div>
    </div>
  );
}