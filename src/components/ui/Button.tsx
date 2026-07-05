import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'danger';

const variantClasses: Record<Variant, string> = {
  primary: 'border border-link-focus bg-link-focus text-white hover:opacity-90',
  secondary:
    'border border-border-default bg-bg-elevated text-text-primary hover:border-border-strong hover:bg-bg-overlay',
  danger:
    'border border-border-default bg-bg-elevated text-status-pending hover:border-status-pending hover:bg-bg-overlay',
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
>(({ variant = 'primary', className = '', ...props }, ref) => (
  <button
    ref={ref}
    className={`cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-link-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
    {...props}
  />
));

Button.displayName = 'Button';
