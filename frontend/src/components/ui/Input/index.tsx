import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...rest }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1">
        {label ? (
          <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={`
            rounded bg-surface-card px-3 py-2 text-text-primary placeholder-text-muted
            border transition-colors duration-150 focus:outline-none focus:ring-2
            focus:ring-accent/50
            ${error ? 'border-red-500' : 'border-surface-hover focus:border-accent'}
            ${className}
          `}
          {...rest}
        />
        {error ? <span className="text-xs text-red-400">{error}</span> : null}
      </div>
    );
  },
);

Input.displayName = 'Input';
