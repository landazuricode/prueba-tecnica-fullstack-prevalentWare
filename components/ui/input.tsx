import * as React from 'react';
import { cn } from '@/lib/utils';
import type { InputProps } from '../../types';

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'bg-transparent focus:ring-2 focus:ring-blue-500 w-full px-3 py-2 disabled:cursor-not-allowed disabled:bg-gray-100 border transition-all duration-300 rounded-md focus:outline-none',
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export { Input };
