import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'subtle' | 'medium' | 'strong';
  delay?: number;
}

export function FloatingElement({ 
  children, 
  className,
  intensity = 'subtle',
  delay = 0
}: FloatingElementProps) {
  const intensities = {
    subtle: { y: [-2, 2, -2], duration: 4 },
    medium: { y: [-4, 4, -4], duration: 3 },
    strong: { y: [-6, 6, -6], duration: 2.5 }
  };

  const current = intensities[intensity];

  return (
    <motion.div
      className={cn(className)}
      animate={{ y: current.y }}
      transition={{
        duration: current.duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }}
    >
      {children}
    </motion.div>
  );
}

interface SparkleProps {
  className?: string;
  color?: 'blue' | 'purple' | 'green' | 'yellow' | 'pink';
  size?: 'sm' | 'md' | 'lg';
}

export function Sparkle({ className, color = 'blue', size = 'sm' }: SparkleProps) {
  const colors = {
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    pink: 'text-pink-400'
  };

  const sizes = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  return (
    <motion.div
      className={cn(
        'absolute rounded-full opacity-70',
        colors[color],
        sizes[size],
        className
      )}
      animate={{
        scale: [0, 1, 0],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatDelay: Math.random() * 3,
        ease: "easeInOut"
      }}
      style={{
        backgroundColor: 'currentColor'
      }}
    />
  );
}

interface ParticleFieldProps {
  className?: string;
  particleCount?: number;
  colors?: Array<'blue' | 'purple' | 'green' | 'yellow' | 'pink'>;
}

export function ParticleField({ 
  className, 
  particleCount = 8,
  colors = ['blue', 'purple', 'green']
}: ParticleFieldProps) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {Array.from({ length: particleCount }).map((_, i) => (
        <Sparkle
          key={i}
          color={colors[i % colors.length]}
          size={Math.random() > 0.7 ? 'md' : 'sm'}
          className="animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}