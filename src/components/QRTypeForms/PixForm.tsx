import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PixContent } from '@/types/qr-types';

interface PixFormProps {
  data: PixContent;
  onChange: (data: PixContent) => void;
}

export function PixForm({ 
  data = { 
    key: '', 
    name: '', 
    city: '', 
    amount: undefined, 
    description: '' 
  }, 
  onChange 
}: PixFormProps) {
  const handleChange = (field: keyof PixContent, value: any) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="key" className="text-sm font-medium">
          Chave PIX *
        </Label>
        <Input
          id="key"
          type="text"
          placeholder="email@exemplo.com ou CPF/CNPJ ou telefone"
          value={data.key || ''}
          onChange={(e) => handleChange('key', e.target.value)}
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Email, CPF, CNPJ, telefone ou chave aleatória
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="text-sm font-medium">
            Nome do Beneficiário *
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="João Silva"
            value={data.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="city" className="text-sm font-medium">
            Cidade *
          </Label>
          <Input
            id="city"
            type="text"
            placeholder="São Paulo"
            value={data.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="amount" className="text-sm font-medium">
          Valor (opcional)
        </Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={data.amount || ''}
          onChange={(e) => handleChange('amount', e.target.value ? parseFloat(e.target.value) : undefined)}
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Deixe vazio para permitir que o pagador escolha o valor
        </p>
      </div>

      <div>
        <Label htmlFor="description" className="text-sm font-medium">
          Descrição
        </Label>
        <Textarea
          id="description"
          placeholder="Pagamento de produto/serviço"
          value={data.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          className="mt-1 min-h-[80px]"
          maxLength={100}
        />
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-muted-foreground">
            Descrição que aparecerá na transação
          </p>
          <span className="text-xs text-muted-foreground">
            {(data.description || '').length}/100
          </span>
        </div>
      </div>
    </div>
  );
}