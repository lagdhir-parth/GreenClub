import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, trend, color = 'primary' }) {
  const colors = {
    primary: 'from-primary-500 to-primary-600',
    accent: 'from-accent-500 to-accent-600',
    danger: 'from-danger-500 to-danger-600',
    success: 'from-success-500 to-success-600',
  };

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="glass-card p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-md`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && (
          <span className={`text-xs font-semibold ${trend > 0 ? 'text-success-500' : 'text-danger-500'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold tracking-tight text-text-primary">
        {value}
      </p>
      <p className="text-sm mt-1 text-text-tertiary">
        {label}
      </p>
    </motion.div>
  );
}
