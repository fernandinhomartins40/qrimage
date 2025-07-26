import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { WhatsAppContent } from '@/types/qr-types';

interface WhatsAppFormProps {
  data: WhatsAppContent;
  onChange: (data: WhatsAppContent) => void;
}

export function WhatsAppForm({ 
  data = { phone: '', message: '' }, 
  onChange 
}: WhatsAppFormProps) {
  const handleChange = (field: keyof WhatsAppContent, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="phone" className="text-sm font-medium">
          Número do WhatsApp *
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+5511999999999"
          value={data.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Include o código do país (ex: +55 para Brasil)
        </p>
      </div>

      <div>
        <Label htmlFor="message" className="text-sm font-medium">
          Mensagem *
        </Label>
        <Textarea
          id="message"
          placeholder="Olá! Entrei em contato através do QR Code..."
          value={data.message || ''}
          onChange={(e) => handleChange('message', e.target.value)}
          className="mt-1 min-h-[100px]"
          maxLength={500}
        />
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-muted-foreground">
            Mensagem pré-preenchida no WhatsApp
          </p>
          <span className="text-xs text-muted-foreground">
            {(data.message || '').length}/500
          </span>
        </div>
      </div>
    </div>
  );
}