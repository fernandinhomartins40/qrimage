import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Link, 
  FileText, 
  Wifi, 
  User, 
  MessageSquare, 
  MessageCircle, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react';
import { QRCodeType } from '@/types/qr-types';

interface QRTypeSelectorProps {
  selectedType: QRCodeType;
  onTypeSelect: (type: QRCodeType) => void;
}

interface QRTypeOption {
  type: QRCodeType;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'basic' | 'contact' | 'location' | 'payment';
  popular?: boolean;
}

const qrTypes: QRTypeOption[] = [
  // Basic
  {
    type: 'url',
    title: 'Link/URL',
    description: 'Redirecionar para um website ou página',
    icon: Link,
    category: 'basic',
    popular: true
  },
  {
    type: 'text',
    title: 'Texto',
    description: 'Exibir uma mensagem de texto simples',
    icon: FileText,
    category: 'basic'
  },
  {
    type: 'wifi',
    title: 'WiFi',
    description: 'Conectar automaticamente à rede WiFi',
    icon: Wifi,
    category: 'basic',
    popular: true
  },
  
  // Contact
  {
    type: 'vcard',
    title: 'Cartão de Visita',
    description: 'Salvar contato na agenda automaticamente',
    icon: User,
    category: 'contact',
    popular: true
  },
  {
    type: 'sms',
    title: 'SMS',
    description: 'Enviar mensagem de texto pré-definida',
    icon: MessageSquare,
    category: 'contact'
  },
  {
    type: 'whatsapp',
    title: 'WhatsApp',
    description: 'Iniciar conversa no WhatsApp',
    icon: MessageCircle,
    category: 'contact',
    popular: true
  },
  {
    type: 'email',
    title: 'Email',
    description: 'Enviar email pré-preenchido',
    icon: Mail,
    category: 'contact'
  },
  {
    type: 'phone',
    title: 'Telefone',
    description: 'Ligar para um número específico',
    icon: Phone,
    category: 'contact'
  },
  
  // Location
  {
    type: 'location',
    title: 'Localização',
    description: 'Mostrar localização no mapa',
    icon: MapPin,
    category: 'location'
  },
  {
    type: 'event',
    title: 'Evento',
    description: 'Adicionar evento ao calendário',
    icon: Calendar,
    category: 'location'
  },
  
  // Payment
  {
    type: 'pix',
    title: 'PIX',
    description: 'Pagamento via PIX (Brasil)',
    icon: DollarSign,
    category: 'payment'
  }
];

const categoryTitles = {
  basic: '📱 Básico',
  contact: '👥 Contato & Comunicação',
  location: '📍 Localização & Eventos',
  payment: '💰 Pagamentos'
};

export function QRTypeSelector({ selectedType, onTypeSelect }: QRTypeSelectorProps) {
  const groupedTypes = qrTypes.reduce((acc, type) => {
    if (!acc[type.category]) {
      acc[type.category] = [];
    }
    acc[type.category].push(type);
    return acc;
  }, {} as Record<string, QRTypeOption[]>);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Escolha o tipo de QR Code
        </h2>
        <p className="text-muted-foreground">
          Selecione o tipo de conteúdo que deseja compartilhar
        </p>
      </div>

      {Object.entries(groupedTypes).map(([category, types]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            {categoryTitles[category as keyof typeof categoryTitles]}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {types.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.type;
              
              return (
                <Card
                  key={type.type}
                  className={`relative cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isSelected 
                      ? 'ring-2 ring-primary bg-primary/5' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => onTypeSelect(type.type)}
                >
                  {type.popular && (
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full z-10">
                      Popular
                    </div>
                  )}
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        isSelected 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-primary/10 text-primary'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">{type.title}</CardTitle>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">
                      {type.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}