import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ShimmerButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'glow';
  onClick?: () => void;
  disabled?: boolean;
}

export function ShimmerButton({ 
  children, 
  className,
  variant = 'gradient',
  onClick,
  disabled = false
}: ShimmerButtonProps) {
  const variants = {
    default: 'bg-primary hover:bg-primary/90',
    gradient: 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700',
    glow: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg hover:shadow-cyan-500/25'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative overflow-hidden rounded-lg"
    >
      <Button
        className={cn(
          'relative overflow-hidden border-0 text-white font-semibold transition-all duration-300',
          variants[variant],
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        onClick={onClick}
        disabled={disabled}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['0%', '200%'] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
            ease: 'linear'
          }}
        />
        
        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </Button>
    </motion.div>
  );
}