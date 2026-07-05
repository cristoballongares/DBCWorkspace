import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary';

const variantClasses: Record<Variant, string> = {
  primary: 'bg-link-focus text-white hover:opacity-90',
  secondary: 'bg-bg-elevated text-text-primary border border-border-default hover:border-border-strong',
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
>(({ variant = 'primary', className = '', ...props }, ref) => (
  <button
    ref={ref}
    className={`rounded-sm px-4 py-2 text-sm font-medium transition-colors duration-150 disabled:opacity-50 ${variantClasses[variant]} ${className}`}
    {...props}
  />
));

Button.displayName = 'Button';
