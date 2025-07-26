import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlowEffectProps {
  children: React.ReactNode;
  className?: string;
  color?: 'blue' | 'purple' | 'green' | 'yellow' | 'pink' | 'teal' | 'orange' | 'red';
  intensity?: 'subtle' | 'medium' | 'strong';
  hover?: boolean;
}

export function GlowEffect({ 
  children, 
  className,
  color = 'blue',
  intensity = 'subtle',
  hover = true
}: GlowEffectProps) {
  const glowColors = {
    blue: {
      subtle: 'shadow-blue-200/30 hover:shadow-blue-300/40',
      medium: 'shadow-blue-300/40 hover:shadow-blue-400/50',
      strong: 'shadow-blue-400/50 hover:shadow-blue-500/60'
    },
    purple: {
      subtle: 'shadow-purple-200/30 hover:shadow-purple-300/40',
      medium: 'shadow-purple-300/40 hover:shadow-purple-400/50',
      strong: 'shadow-purple-400/50 hover:shadow-purple-500/60'
    },
    green: {
      subtle: 'shadow-green-200/30 hover:shadow-green-300/40',
      medium: 'shadow-green-300/40 hover:shadow-green-400/50',
      strong: 'shadow-green-400/50 hover:shadow-green-500/60'
    },
    yellow: {
      subtle: 'shadow-yellow-200/30 hover:shadow-yellow-300/40',
      medium: 'shadow-yellow-300/40 hover:shadow-yellow-400/50',
      strong: 'shadow-yellow-400/50 hover:shadow-yellow-500/60'
    },
    pink: {
      subtle: 'shadow-pink-200/30 hover:shadow-pink-300/40',
      medium: 'shadow-pink-300/40 hover:shadow-pink-400/50',
      strong: 'shadow-pink-400/50 hover:shadow-pink-500/60'
    },
    teal: {
      subtle: 'shadow-teal-200/30 hover:shadow-teal-300/40',
      medium: 'shadow-teal-300/40 hover:shadow-teal-400/50',
      strong: 'shadow-teal-400/50 hover:shadow-teal-500/60'
    },
    orange: {
      subtle: 'shadow-orange-200/30 hover:shadow-orange-300/40',
      medium: 'shadow-orange-300/40 hover:shadow-orange-400/50',
      strong: 'shadow-orange-400/50 hover:shadow-orange-500/60'
    },
    red: {
      subtle: 'shadow-red-200/30 hover:shadow-red-300/40',
      medium: 'shadow-red-300/40 hover:shadow-red-400/50',
      strong: 'shadow-red-400/50 hover:shadow-red-500/60'
    }
  };

  return (
    <motion.div
      className={cn(
        'transition-all duration-300',
        glowColors[color][intensity],
        hover && 'group-hover:shadow-lg',
        className
      )}
      whileHover={hover ? { 
        scale: 1.02,
        transition: { duration: 0.2 }
      } : {}}
    >
      {children}
    </motion.div>
  );
}

interface ShimmerEffectProps {
  children: React.ReactNode;
  className?: string;
  color?: 'blue' | 'purple' | 'green' | 'yellow' | 'pink';
}

export function ShimmerEffect({ 
  children, 
  className,
  color = 'blue'
}: ShimmerEffectProps) {
  const shimmerColors = {
    blue: 'from-blue-200/0 via-blue-200/40 to-blue-200/0',
    purple: 'from-purple-200/0 via-purple-200/40 to-purple-200/0',
    green: 'from-green-200/0 via-green-200/40 to-green-200/0',
    yellow: 'from-yellow-200/0 via-yellow-200/40 to-yellow-200/0',
    pink: 'from-pink-200/0 via-pink-200/40 to-pink-200/0'
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {children}
      <motion.div
        className={cn(
          'absolute inset-0 bg-gradient-to-r',
          shimmerColors[color]
        )}
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}