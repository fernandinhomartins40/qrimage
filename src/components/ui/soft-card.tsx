import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SoftCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  accentColor?: string;
  selected?: boolean;
}

export function SoftCard({ 
  children, 
  className, 
  hover = true, 
  delay = 0,
  accentColor = 'blue',
  selected = false
}: SoftCardProps) {
  const accentColors = {
    blue: 'border-blue-200/50 bg-gradient-to-br from-blue-50/30 to-blue-50/10 shadow-blue-100/30',
    green: 'border-green-200/50 bg-gradient-to-br from-green-50/30 to-green-50/10 shadow-green-100/30',
    purple: 'border-purple-200/50 bg-gradient-to-br from-purple-50/30 to-purple-50/10 shadow-purple-100/30',
    orange: 'border-orange-200/50 bg-gradient-to-br from-orange-50/30 to-orange-50/10 shadow-orange-100/30',
    red: 'border-red-200/50 bg-gradient-to-br from-red-50/30 to-red-50/10 shadow-red-100/30',
    teal: 'border-teal-200/50 bg-gradient-to-br from-teal-50/30 to-teal-50/10 shadow-teal-100/30',
    pink: 'border-pink-200/50 bg-gradient-to-br from-pink-50/30 to-pink-50/10 shadow-pink-100/30',
    indigo: 'border-indigo-200/50 bg-gradient-to-br from-indigo-50/30 to-indigo-50/10 shadow-indigo-100/30',
    yellow: 'border-yellow-200/50 bg-gradient-to-br from-yellow-50/30 to-yellow-50/10 shadow-yellow-100/30',
    rose: 'border-rose-200/50 bg-gradient-to-br from-rose-50/30 to-rose-50/10 shadow-rose-100/30',
    gray: 'border-gray-200/50 bg-gradient-to-br from-gray-50/30 to-gray-50/10 shadow-gray-100/30'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4,
        delay: delay * 0.1,
        ease: [0.25, 0.25, 0, 1]
      }}
      whileHover={hover ? { 
        y: -4,
        transition: { duration: 0.2 }
      } : {}}
      className="group"
    >
      <Card className={cn(
        'relative overflow-hidden transition-all duration-300 border-0',
        'bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-lg',
        selected && accentColors[accentColor as keyof typeof accentColors],
        'hover:bg-white/90 hover:shadow-colored',
        className
      )}>
        {selected && (
          <div className={`absolute top-0 left-0 w-full h-1 bg-${accentColor}-400`} />
        )}
        {children}
      </Card>
    </motion.div>
  );
}

interface SoftCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function SoftCardHeader({ children, className }: SoftCardHeaderProps) {
  return (
    <CardHeader className={cn('pb-3', className)}>
      {children}
    </CardHeader>
  );
}

interface SoftCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function SoftCardContent({ children, className }: SoftCardContentProps) {
  return (
    <CardContent className={cn('pt-0', className)}>
      {children}
    </CardContent>
  );
}