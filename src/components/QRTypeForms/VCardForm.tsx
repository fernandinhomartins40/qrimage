import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VCardContent } from '@/types/qr-types';

interface VCardFormProps {
  data: VCardContent;
  onChange: (data: VCardContent) => void;
}

export function VCardForm({ 
  data = { 
    firstName: '', 
    lastName: '', 
    organization: '', 
    phone: '', 
    email: '', 
    url: '', 
    address: '' 
  }, 
  onChange 
}: VCardFormProps) {
  const handleChange = (field: keyof VCardContent, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" className="text-sm font-medium">
            Nome *
          </Label>
          <Input
            id="firstName"
            type="text"
            placeholder="João"
            value={data.firstName || ''}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="lastName" className="text-sm font-medium">
            Sobrenome *
          </Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Silva"
            value={data.lastName || ''}
            onChange={(e) => handleChange('lastName', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="organization" className="text-sm font-medium">
          Empresa/Organização
        </Label>
        <Input
          id="organization"
          type="text"
          placeholder="Minha Empresa Ltda"
          value={data.organization || ''}
          onChange={(e) => handleChange('organization', e.target.value)}
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone" className="text-sm font-medium">
            Telefone
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
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="joao@exemplo.com"
            value={data.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="url" className="text-sm font-medium">
          Website
        </Label>
        <Input
          id="url"
          type="url"
          placeholder="https://meusite.com"
          value={data.url || ''}
          onChange={(e) => handleChange('url', e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="address" className="text-sm font-medium">
          Endereço
        </Label>
        <Input
          id="address"
          type="text"
          placeholder="Rua das Flores, 123, São Paulo, SP"
          value={data.address || ''}
          onChange={(e) => handleChange('address', e.target.value)}
          className="mt-1"
        />
      </div>
    </div>
  );
}