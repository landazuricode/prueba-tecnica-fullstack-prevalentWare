import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      children,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center rounded-lg font-medium transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

    const variants = {
      default: 'bg-blue-500 text-white hover:bg-blue-600',
      outline:
        'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
    };

    const sizes = {
      default: 'h-10 px-3 py-2',
      sm: 'h-9 px-2.5 text-sm',
      lg: 'h-11 px-8',
      icon: 'h-10 w-10',
    };

    const widthClasses = fullWidth ? 'w-full sm:w-auto' : '';

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          widthClasses,
          className
        )}
        ref={ref}
        {...props}
      >
        {icon && iconPosition === 'left' && (
          <span className='mr-2'>{icon}</span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <span className='ml-2'>{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
