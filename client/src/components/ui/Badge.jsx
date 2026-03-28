const variants = {
  active: 'bg-primary-500/10 text-primary-600 border-primary-500/20',
  inactive: 'bg-surface-200 dark:bg-surface-700',
  pending: 'bg-accent-500/10 text-accent-600 border-accent-500/20',
  approved: 'bg-primary-500/10 text-primary-600 border-primary-500/20',
  paid: 'bg-success-500/10 text-success-600 border-success-500/20',
  expired: 'bg-danger-500/10 text-danger-500 border-danger-500/20',
};

export default function Badge({ status, children, className = '' }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border
        ${variants[status] || variants.inactive}
        ${className}
      `}
      style={!variants[status] ? { color: 'var(--text-tertiary)', borderColor: 'var(--border-color)' } : {}}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === 'active' || status === 'approved' ? 'bg-primary-500' :
        status === 'pending' ? 'bg-accent-500' :
        status === 'paid' ? 'bg-success-500' :
        status === 'expired' ? 'bg-danger-500' :
        'bg-surface-400'
      }`} />
      {children || status}
    </span>
  );
}
