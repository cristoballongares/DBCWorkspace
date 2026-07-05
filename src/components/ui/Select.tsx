import { SelectHTMLAttributes, forwardRef } from 'react';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = '', ...props }, ref) => (
    <select
      ref={ref}
      className={`w-full cursor-pointer rounded-md border border-border-default bg-bg-surface px-3 py-2 text-sm text-text-primary focus:border-link-focus focus:outline-none focus:ring-1 focus:ring-link-focus ${className}`}
      {...props}
    />
  ),
);

Select.displayName = 'Select';
