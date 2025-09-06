import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          ' bg-transparent focus:ring-blue-500 false w-full px-3 py-2 disabled:cursor-not-allowed disabled:bg-gray-100 border transition-all duration-300 rounded-md focus:outline-none focus:ring-2',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
