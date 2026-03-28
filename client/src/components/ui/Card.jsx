import { motion } from 'framer-motion';

export default function Card({
  children,
  hover = true,
  className = '',
  padding = 'p-6',
  ...props
}) {
  const Component = hover ? motion.div : 'div';
  const motionProps = hover
    ? { whileHover: { y: -2, transition: { duration: 0.2 } } }
    : {};

  return (
    <Component
      className={`${hover ? 'glass-card' : 'glass-card-static'} ${padding} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
}
