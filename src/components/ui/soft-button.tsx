import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SoftButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  color?: string;
}

export function SoftButton({ 
  children, 
  className,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  color = 'blue'
}: SoftButtonProps) {
  const variants = {
    primary: {
      blue: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-blue-500/30 hover:shadow-blue-600/50',
      green: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-green-500/30 hover:shadow-green-600/50',
      purple: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-purple-500/30 hover:shadow-purple-600/50',
      orange: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-orange-500/30 hover:shadow-orange-600/50',
      red: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-red-500/30 hover:shadow-red-600/50',
      yellow: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-yellow-500/30 hover:shadow-yellow-600/50',
      teal: 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-teal-500/30 hover:shadow-teal-600/50',
      indigo: 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-indigo-500/30 hover:shadow-indigo-600/50',
      rose: 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-rose-500/30 hover:shadow-rose-600/50',
      gray: 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-gray-500/30 hover:shadow-gray-600/50'
    },
    secondary: {
      blue: 'bg-gradient-to-r from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-200/50 text-blue-600 border-blue-200/60 shadow-blue-100/50',
      green: 'bg-gradient-to-r from-green-50 to-green-100/50 hover:from-green-100 hover:to-green-200/50 text-green-600 border-green-200/60 shadow-green-100/50',
      purple: 'bg-gradient-to-r from-purple-50 to-purple-100/50 hover:from-purple-100 hover:to-purple-200/50 text-purple-600 border-purple-200/60 shadow-purple-100/50',
      orange: 'bg-gradient-to-r from-orange-50 to-orange-100/50 hover:from-orange-100 hover:to-orange-200/50 text-orange-600 border-orange-200/60 shadow-orange-100/50',
      red: 'bg-gradient-to-r from-red-50 to-red-100/50 hover:from-red-100 hover:to-red-200/50 text-red-600 border-red-200/60 shadow-red-100/50',
      yellow: 'bg-gradient-to-r from-yellow-50 to-yellow-100/50 hover:from-yellow-100 hover:to-yellow-200/50 text-yellow-600 border-yellow-200/60 shadow-yellow-100/50',
      teal: 'bg-gradient-to-r from-teal-50 to-teal-100/50 hover:from-teal-100 hover:to-teal-200/50 text-teal-600 border-teal-200/60 shadow-teal-100/50',
      indigo: 'bg-gradient-to-r from-indigo-50 to-indigo-100/50 hover:from-indigo-100 hover:to-indigo-200/50 text-indigo-600 border-indigo-200/60 shadow-indigo-100/50',
      rose: 'bg-gradient-to-r from-rose-50 to-rose-100/50 hover:from-rose-100 hover:to-rose-200/50 text-rose-600 border-rose-200/60 shadow-rose-100/50',
      gray: 'bg-gradient-to-r from-gray-50 to-gray-100/50 hover:from-gray-100 hover:to-gray-200/50 text-gray-600 border-gray-200/60 shadow-gray-100/50'
    },
    success: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-emerald-500/30 hover:shadow-emerald-600/50',
    outline: 'border-2 border-gray-200/60 hover:border-gray-300/60 bg-gradient-to-r from-white to-gray-50/30 hover:from-gray-50 hover:to-gray-100/30 shadow-gray-100/30'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const getVariantClass = () => {
    if (variant === 'success' || variant === 'outline') {
      return variants[variant];
    }
    return variants[variant][color as keyof typeof variants[typeof variant]];
  };

  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      <Button
        className={cn(
          'relative overflow-hidden font-medium transition-all duration-200',
          'shadow-lg hover:shadow-xl border-0',
          getVariantClass(),
          sizes[size],
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        onClick={onClick}
        disabled={disabled}
      >
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </Button>
    </motion.div>
  );
}