import { motion } from 'framer-motion';
import { SoftCard, SoftCardContent, SoftCardHeader } from '@/components/ui/soft-card';
import { ColorAccent } from '@/components/ui/color-accent';
import { Badge } from '@/components/ui/badge';
import { AnimatedContainer } from '@/components/ui/animated-container';
import { GlowEffect, ShimmerEffect } from '@/components/ui/glow-effect';
import { FloatingElement, ParticleField } from '@/components/ui/floating-elements';
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
  DollarSign,
  Sparkles,
  Star
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
  color: string;
}

const qrTypes: QRTypeOption[] = [
  // Basic
  {
    type: 'url',
    title: 'Link/URL',
    description: 'Redirecionar para um website ou página',
    icon: Link,
    category: 'basic',
    popular: true,
    color: 'blue'
  },
  {
    type: 'text',
    title: 'Texto',
    description: 'Exibir uma mensagem de texto simples',
    icon: FileText,
    category: 'basic',
    color: 'gray'
  },
  {
    type: 'wifi',
    title: 'WiFi',
    description: 'Conectar automaticamente à rede WiFi',
    icon: Wifi,
    category: 'basic',
    popular: true,
    color: 'teal'
  },
  
  // Contact
  {
    type: 'vcard',
    title: 'Cartão de Visita',
    description: 'Salvar contato na agenda automaticamente',
    icon: User,
    category: 'contact',
    popular: true,
    color: 'purple'
  },
  {
    type: 'sms',
    title: 'SMS',
    description: 'Enviar mensagem de texto pré-definida',
    icon: MessageSquare,
    category: 'contact',
    color: 'orange'
  },
  {
    type: 'whatsapp',
    title: 'WhatsApp',
    description: 'Iniciar conversa no WhatsApp',
    icon: MessageCircle,
    category: 'contact',
    popular: true,
    color: 'green'
  },
  {
    type: 'email',
    title: 'Email',
    description: 'Enviar email pré-preenchido',
    icon: Mail,
    category: 'contact',
    color: 'red'
  },
  {
    type: 'phone',
    title: 'Telefone',
    description: 'Ligar para um número específico',
    icon: Phone,
    category: 'contact',
    color: 'indigo'
  },
  
  // Location
  {
    type: 'location',
    title: 'Localização',
    description: 'Mostrar localização no mapa',
    icon: MapPin,
    category: 'location',
    color: 'rose'
  },
  {
    type: 'event',
    title: 'Evento',
    description: 'Adicionar evento ao calendário',
    icon: Calendar,
    category: 'location',
    color: 'purple'
  },
  
  // Payment
  {
    type: 'pix',
    title: 'PIX',
    description: 'Pagamento via PIX (Brasil)',
    icon: DollarSign,
    category: 'payment',
    color: 'yellow'
  }
];

const categoryConfig = {
  basic: {
    title: 'Essenciais',
    subtitle: 'Tipos fundamentais para uso diário',
    icon: Sparkles,
    color: 'blue'
  },
  contact: {
    title: 'Comunicação',
    subtitle: 'Conecte-se facilmente com pessoas',
    icon: MessageCircle,
    color: 'purple'
  },
  location: {
    title: 'Localização',
    subtitle: 'Compartilhe lugares e eventos',
    icon: MapPin,
    color: 'teal'
  },
  payment: {
    title: 'Pagamentos',
    subtitle: 'Receba pagamentos digitais',
    icon: DollarSign,
    color: 'yellow'
  }
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
    <div className="min-h-screen bg-slate-50/50 relative overflow-hidden">
      <ParticleField className="opacity-20" particleCount={12} colors={['blue', 'purple', 'teal', 'green']} />
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
          {/* Header */}
          <AnimatedContainer 
            className="text-center space-y-6"
            animation="slide"
            direction="up"
            delay={0.1}
          >
            <GlowEffect color="blue" intensity="subtle">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white shadow-sm border border-gray-100">
                <FloatingElement intensity="subtle">
                  <ColorAccent color="blue" size="sm">
                    <Sparkles className="h-3 w-3" />
                  </ColorAccent>
                </FloatingElement>
                <span className="text-sm font-medium text-gray-600">
                  Gerador Inteligente de QR Codes
                </span>
              </div>
            </GlowEffect>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Escolha o tipo de{' '}
                <span className="text-blue-600">QR Code</span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Selecione o tipo de conteúdo que deseja compartilhar de forma inteligente e moderna
              </p>
            </div>
          </AnimatedContainer>

          {/* Categories */}
          <div className="space-y-16">
            {Object.entries(groupedTypes).map(([category, types], categoryIndex) => {
              const config = categoryConfig[category as keyof typeof categoryConfig];
              const Icon = config.icon;
              
              return (
                <AnimatedContainer
                  key={category}
                  animation="slide"
                  direction="up"
                  delay={categoryIndex * 0.15}
                  className="space-y-8"
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-4">
                    <FloatingElement intensity="subtle" delay={categoryIndex * 0.2}>
                      <GlowEffect color={config.color} intensity="medium">
                        <ColorAccent color={config.color} size="md">
                          <Icon className="h-5 w-5" />
                        </ColorAccent>
                      </GlowEffect>
                    </FloatingElement>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {config.title}
                      </h2>
                      <p className="text-gray-600">
                        {config.subtitle}
                      </p>
                    </div>
                  </div>
                  
                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {types.map((type, index) => {
                      const Icon = type.icon;
                      const isSelected = selectedType === type.type;
                      
                      return (
                        <SoftCard
                          key={type.type}
                          delay={index}
                          accentColor={type.color}
                          selected={isSelected}
                          className="cursor-pointer h-full"
                          onClick={() => onTypeSelect(type.type)}
                        >
                          <SoftCardHeader>
                            <div className="flex items-start justify-between mb-4">
                              <ShimmerEffect color={type.color}>
                                <ColorAccent 
                                  color={type.color} 
                                  size="md"
                                  soft={!isSelected}
                                >
                                  <Icon className="h-5 w-5" />
                                </ColorAccent>
                              </ShimmerEffect>
                              
                              {type.popular && (
                                <GlowEffect color="yellow" intensity="subtle">
                                  <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200">
                                    <FloatingElement intensity="subtle">
                                      <Star className="h-3 w-3 mr-1" />
                                    </FloatingElement>
                                    Popular
                                  </Badge>
                                </GlowEffect>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {type.title}
                              </h3>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {type.description}
                              </p>
                            </div>
                          </SoftCardHeader>
                          
                          <SoftCardContent>
                            {isSelected && (
                              <motion.div 
                                className="flex items-center gap-2 text-xs font-medium text-blue-600"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                Selecionado
                              </motion.div>
                            )}
                          </SoftCardContent>
                        </SoftCard>
                      );
                    })}
                  </div>
                </AnimatedContainer>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}