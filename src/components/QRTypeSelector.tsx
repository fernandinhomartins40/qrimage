import { motion } from 'framer-motion';
import { AnimatedCard, AnimatedCardContent, AnimatedCardHeader } from '@/components/ui/animated-card';
import { GradientText } from '@/components/ui/gradient-text';
import { FloatingIcon } from '@/components/ui/floating-icon';
import { Badge } from '@/components/ui/badge';
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
  Zap,
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
  gradient: string;
  iconColor: string;
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
    gradient: 'from-blue-500 to-cyan-500',
    iconColor: 'bg-gradient-to-br from-blue-500 to-cyan-500'
  },
  {
    type: 'text',
    title: 'Texto',
    description: 'Exibir uma mensagem de texto simples',
    icon: FileText,
    category: 'basic',
    gradient: 'from-gray-500 to-slate-600',
    iconColor: 'bg-gradient-to-br from-gray-500 to-slate-600'
  },
  {
    type: 'wifi',
    title: 'WiFi',
    description: 'Conectar automaticamente à rede WiFi',
    icon: Wifi,
    category: 'basic',
    popular: true,
    gradient: 'from-emerald-500 to-teal-500',
    iconColor: 'bg-gradient-to-br from-emerald-500 to-teal-500'
  },
  
  // Contact
  {
    type: 'vcard',
    title: 'Cartão de Visita',
    description: 'Salvar contato na agenda automaticamente',
    icon: User,
    category: 'contact',
    popular: true,
    gradient: 'from-purple-500 to-violet-500',
    iconColor: 'bg-gradient-to-br from-purple-500 to-violet-500'
  },
  {
    type: 'sms',
    title: 'SMS',
    description: 'Enviar mensagem de texto pré-definida',
    icon: MessageSquare,
    category: 'contact',
    gradient: 'from-amber-500 to-orange-500',
    iconColor: 'bg-gradient-to-br from-amber-500 to-orange-500'
  },
  {
    type: 'whatsapp',
    title: 'WhatsApp',
    description: 'Iniciar conversa no WhatsApp',
    icon: MessageCircle,
    category: 'contact',
    popular: true,
    gradient: 'from-green-500 to-emerald-500',
    iconColor: 'bg-gradient-to-br from-green-500 to-emerald-500'
  },
  {
    type: 'email',
    title: 'Email',
    description: 'Enviar email pré-preenchido',
    icon: Mail,
    category: 'contact',
    gradient: 'from-red-500 to-pink-500',
    iconColor: 'bg-gradient-to-br from-red-500 to-pink-500'
  },
  {
    type: 'phone',
    title: 'Telefone',
    description: 'Ligar para um número específico',
    icon: Phone,
    category: 'contact',
    gradient: 'from-indigo-500 to-blue-500',
    iconColor: 'bg-gradient-to-br from-indigo-500 to-blue-500'
  },
  
  // Location
  {
    type: 'location',
    title: 'Localização',
    description: 'Mostrar localização no mapa',
    icon: MapPin,
    category: 'location',
    gradient: 'from-rose-500 to-pink-500',
    iconColor: 'bg-gradient-to-br from-rose-500 to-pink-500'
  },
  {
    type: 'event',
    title: 'Evento',
    description: 'Adicionar evento ao calendário',
    icon: Calendar,
    category: 'location',
    gradient: 'from-violet-500 to-purple-500',
    iconColor: 'bg-gradient-to-br from-violet-500 to-purple-500'
  },
  
  // Payment
  {
    type: 'pix',
    title: 'PIX',
    description: 'Pagamento via PIX (Brasil)',
    icon: DollarSign,
    category: 'payment',
    gradient: 'from-yellow-500 to-amber-500',
    iconColor: 'bg-gradient-to-br from-yellow-500 to-amber-500'
  }
];

const categoryConfig = {
  basic: {
    title: '⚡ Essenciais',
    subtitle: 'Tipos fundamentais para uso diário',
    icon: Zap,
    gradient: 'from-blue-600 to-cyan-600'
  },
  contact: {
    title: '👥 Comunicação',
    subtitle: 'Conecte-se facilmente com pessoas',
    icon: MessageCircle,
    gradient: 'from-purple-600 to-pink-600'
  },
  location: {
    title: '📍 Localização',
    subtitle: 'Compartilhe lugares e eventos',
    icon: MapPin,
    gradient: 'from-emerald-600 to-teal-600'
  },
  payment: {
    title: '💰 Pagamentos',
    subtitle: 'Receba pagamentos digitais',
    icon: DollarSign,
    gradient: 'from-yellow-600 to-orange-600'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-red-600/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 space-y-12 py-12">
          {/* Header */}
          <motion.div 
            className="text-center space-y-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.21, 1, 0.81, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 shadow-lg">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Gerador Inteligente de QR Codes
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 dark:text-white">
              Escolha o tipo de{' '}
              <GradientText 
                gradient="from-blue-600 via-purple-600 to-pink-600"
                animate
              >
                QR Code
              </GradientText>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Selecione o tipo de conteúdo que deseja compartilhar de forma inteligente e moderna
            </p>
          </motion.div>

          {/* Categories */}
          <div className="max-w-7xl mx-auto px-4 space-y-16">
            {Object.entries(groupedTypes).map(([category, types], categoryIndex) => {
              const config = categoryConfig[category as keyof typeof categoryConfig];
              const Icon = config.icon;
              
              return (
                <motion.div 
                  key={category}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.8,
                    delay: (categoryIndex + 1) * 0.2,
                    ease: [0.21, 1, 0.81, 1]
                  }}
                  className="space-y-8"
                >
                  {/* Category Header */}
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-3">
                      <FloatingIcon
                        color={`bg-gradient-to-br ${config.gradient}`}
                        size="md"
                      >
                        <Icon className="h-6 w-6" />
                      </FloatingIcon>
                      <div className="text-left">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
                          {config.title}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">
                          {config.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {types.map((type, index) => {
                      const Icon = type.icon;
                      const isSelected = selectedType === type.type;
                      
                      return (
                        <AnimatedCard
                          key={type.type}
                          delay={index}
                          glow={isSelected}
                          className={`cursor-pointer transition-all duration-300 h-full ${
                            isSelected 
                              ? `ring-2 ring-offset-2 ring-blue-500 bg-gradient-to-br ${type.gradient}/10` 
                              : 'hover:shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm'
                          }`}
                          onClick={() => onTypeSelect(type.type)}
                        >
                          <AnimatedCardHeader className="space-y-4">
                            <div className="flex items-start justify-between">
                              <FloatingIcon
                                color={type.iconColor}
                                size="md"
                                glow={isSelected}
                              >
                                <Icon className="h-6 w-6" />
                              </FloatingIcon>
                              
                              <div className="flex gap-2">
                                {type.popular && (
                                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
                                    <Star className="h-3 w-3 mr-1" />
                                    Popular
                                  </Badge>
                                )}
                                {isSelected && (
                                  <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0 shadow-lg">
                                    ✓ Selecionado
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                                {type.title}
                              </h3>
                              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                {type.description}
                              </p>
                            </div>
                          </AnimatedCardHeader>
                          
                          <AnimatedCardContent className="pt-0">
                            <motion.div 
                              className={`w-full h-1 rounded-full bg-gradient-to-r ${type.gradient}`}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: isSelected ? 1 : 0.3 }}
                              transition={{ duration: 0.3 }}
                            />
                          </AnimatedCardContent>
                        </AnimatedCard>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}