import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md hover:shadow-lg hover:from-primary-700 hover:to-primary-600',
  secondary: 'bg-surface-100 dark:bg-surface-800 text-text-primary hover:bg-surface-200 dark:hover:bg-surface-700',
  outline: 'border border-border text-text-primary hover:bg-surface-50 dark:hover:bg-surface-800',
  danger: 'bg-danger-500 text-white hover:bg-danger-600 shadow-md',
  ghost: 'text-text-primary hover:bg-surface-100 dark:hover:bg-surface-800',
  accent: 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md hover:shadow-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  };

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-semibold
        transition-all duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </motion.button>
  );
}
