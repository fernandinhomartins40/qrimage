import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FloatingIconProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  glow?: boolean;
}

export function FloatingIcon({ 
  children, 
  className,
  size = 'md',
  color = 'bg-gradient-to-br from-blue-500 to-purple-600',
  glow = true
}: FloatingIconProps) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <motion.div
      className={cn(
        'relative rounded-xl flex items-center justify-center text-white',
        sizeClasses[size],
        color,
        glow && 'shadow-lg',
        className
      )}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        duration: 0.5,
        ease: [0.21, 1, 0.81, 1]
      }}
      whileHover={{ 
        scale: 1.1,
        rotate: 5,
        transition: { duration: 0.2 }
      }}
    >
      {glow && (
        <motion.div
          className={cn(
            'absolute inset-0 rounded-xl blur-md opacity-50',
            color
          )}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}