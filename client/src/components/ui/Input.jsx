import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, error, icon: Icon, type = 'text', className = '', ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
            <Icon className="w-[18px] h-[18px]" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`
            w-full rounded-xl text-sm transition-all duration-200
            outline-none focus:ring-2 focus:ring-primary-500/30
            ${Icon ? 'pl-10 pr-4' : 'px-4'}
            py-2.5 bg-bg-secondary text-text-primary
            ${error 
              ? 'border-danger-500 focus:ring-danger-500/30' 
              : 'border-border focus:border-primary-500 hover:border-text-tertiary'}
            border
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-danger-500">{error}</p>
      )}
    </div>
  );
});

export default Input;
