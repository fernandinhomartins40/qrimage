import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  gradient?: string;
  glow?: boolean;
}

export function AnimatedCard({ 
  children, 
  className, 
  hover = true, 
  delay = 0,
  gradient,
  glow = false
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: delay * 0.1,
        ease: [0.21, 1, 0.81, 1]
      }}
      whileHover={hover ? { 
        y: -8,
        transition: { duration: 0.2 }
      } : {}}
      className="group"
    >
      <Card className={cn(
        'relative overflow-hidden transition-all duration-500',
        gradient && `bg-gradient-to-br ${gradient}`,
        glow && 'shadow-2xl hover:shadow-3xl',
        'border-border/50 hover:border-border',
        className
      )}>
        {glow && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        )}
        {children}
      </Card>
    </motion.div>
  );
}

interface AnimatedCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedCardHeader({ children, className }: AnimatedCardHeaderProps) {
  return (
    <CardHeader className={cn('relative z-10', className)}>
      {children}
    </CardHeader>
  );
}

interface AnimatedCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedCardContent({ children, className }: AnimatedCardContentProps) {
  return (
    <CardContent className={cn('relative z-10', className)}>
      {children}
    </CardContent>
  );
}