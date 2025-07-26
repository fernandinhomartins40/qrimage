import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  animate?: boolean;
}

export function GradientText({ 
  children, 
  className,
  gradient = "from-blue-600 via-purple-600 to-pink-600",
  animate = false
}: GradientTextProps) {
  const Component = animate ? motion.span : 'span';
  
  return (
    <Component
      className={cn(
        'bg-gradient-to-r bg-clip-text text-transparent font-bold',
        gradient,
        className
      )}
      {...(animate && {
        initial: { backgroundPosition: '0% 50%' },
        animate: { backgroundPosition: '100% 50%' },
        transition: {
          duration: 3,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear'
        }
      })}
    >
      {children}
    </Component>
  );
}