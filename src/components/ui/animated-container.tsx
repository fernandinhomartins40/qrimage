import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: 'fade' | 'slide' | 'scale' | 'bounce';
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function AnimatedContainer({ 
  children, 
  className,
  delay = 0,
  animation = 'fade',
  direction = 'up'
}: AnimatedContainerProps) {
  const getInitialState = () => {
    switch (animation) {
      case 'slide':
        switch (direction) {
          case 'up': return { opacity: 0, y: 20 };
          case 'down': return { opacity: 0, y: -20 };
          case 'left': return { opacity: 0, x: -20 };
          case 'right': return { opacity: 0, x: 20 };
          default: return { opacity: 0, y: 20 };
        }
      case 'scale':
        return { opacity: 0, scale: 0.9 };
      case 'bounce':
        return { opacity: 0, scale: 0.8, rotate: -3 };
      default:
        return { opacity: 0 };
    }
  };

  const getAnimateState = () => {
    switch (animation) {
      case 'slide':
        return { opacity: 1, x: 0, y: 0 };
      case 'scale':
        return { opacity: 1, scale: 1 };
      case 'bounce':
        return { opacity: 1, scale: 1, rotate: 0 };
      default:
        return { opacity: 1 };
    }
  };

  const getTransition = () => {
    switch (animation) {
      case 'bounce':
        return {
          duration: 0.6,
          delay,
          type: "spring",
          stiffness: 200,
          damping: 20
        };
      case 'scale':
        return {
          duration: 0.4,
          delay,
          ease: [0.25, 0.25, 0, 1]
        };
      default:
        return {
          duration: 0.5,
          delay,
          ease: [0.25, 0.25, 0, 1]
        };
    }
  };

  return (
    <motion.div
      className={cn(className)}
      initial={getInitialState()}
      animate={getAnimateState()}
      transition={getTransition()}
    >
      {children}
    </motion.div>
  );
}