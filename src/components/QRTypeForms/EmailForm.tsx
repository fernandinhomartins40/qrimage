import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { EmailContent } from '@/types/qr-types';

interface EmailFormProps {
  data: EmailContent;
  onChange: (data: EmailContent) => void;
}

export function EmailForm({ 
  data = { email: '', subject: '', body: '' }, 
  onChange 
}: EmailFormProps) {
  const handleChange = (field: keyof EmailContent, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="email" className="text-sm font-medium">
          Email de Destino *
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="contato@exemplo.com"
          value={data.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="subject" className="text-sm font-medium">
          Assunto
        </Label>
        <Input
          id="subject"
          type="text"
          placeholder="Assunto do email"
          value={data.subject || ''}
          onChange={(e) => handleChange('subject', e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="body" className="text-sm font-medium">
          Mensagem
        </Label>
        <Textarea
          id="body"
          placeholder="Corpo do email..."
          value={data.body || ''}
          onChange={(e) => handleChange('body', e.target.value)}
          className="mt-1 min-h-[120px]"
        />
      </div>
    </div>
  );
}