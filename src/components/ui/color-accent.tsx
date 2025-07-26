import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ColorAccentProps {
  children: React.ReactNode;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  soft?: boolean;
}

export function ColorAccent({ 
  children, 
  color, 
  size = 'md',
  className,
  soft = true
}: ColorAccentProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    blue: soft ? 'bg-gradient-to-br from-blue-50 to-blue-100/60 text-blue-600 border-blue-200/50 shadow-blue-100/40' : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/40',
    green: soft ? 'bg-gradient-to-br from-green-50 to-green-100/60 text-green-600 border-green-200/50 shadow-green-100/40' : 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-500/40',
    purple: soft ? 'bg-gradient-to-br from-purple-50 to-purple-100/60 text-purple-600 border-purple-200/50 shadow-purple-100/40' : 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-purple-500/40',
    orange: soft ? 'bg-gradient-to-br from-orange-50 to-orange-100/60 text-orange-600 border-orange-200/50 shadow-orange-100/40' : 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-orange-500/40',
    red: soft ? 'bg-gradient-to-br from-red-50 to-red-100/60 text-red-600 border-red-200/50 shadow-red-100/40' : 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-red-500/40',
    teal: soft ? 'bg-gradient-to-br from-teal-50 to-teal-100/60 text-teal-600 border-teal-200/50 shadow-teal-100/40' : 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-teal-500/40',
    pink: soft ? 'bg-gradient-to-br from-pink-50 to-pink-100/60 text-pink-600 border-pink-200/50 shadow-pink-100/40' : 'bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-pink-500/40',
    indigo: soft ? 'bg-gradient-to-br from-indigo-50 to-indigo-100/60 text-indigo-600 border-indigo-200/50 shadow-indigo-100/40' : 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-indigo-500/40',
    yellow: soft ? 'bg-gradient-to-br from-yellow-50 to-yellow-100/60 text-yellow-600 border-yellow-200/50 shadow-yellow-100/40' : 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-yellow-500/40',
    rose: soft ? 'bg-gradient-to-br from-rose-50 to-rose-100/60 text-rose-600 border-rose-200/50 shadow-rose-100/40' : 'bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-rose-500/40',
    gray: soft ? 'bg-gradient-to-br from-gray-50 to-gray-100/60 text-gray-600 border-gray-200/50 shadow-gray-100/40' : 'bg-gradient-to-br from-gray-500 to-gray-600 text-white shadow-gray-500/40'
  };

  return (
    <motion.div
      className={cn(
        'rounded-xl flex items-center justify-center transition-all duration-200',
        'border shadow-sm hover:shadow-md',
        sizes[size],
        colorClasses[color as keyof typeof colorClasses],
        className
      )}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
}