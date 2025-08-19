import React from 'react';
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800',
        secondary: 'border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
        destructive: 'border-transparent bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800',
        outline: 'text-gray-950 dark:text-gray-50 border-gray-200 dark:border-gray-800',
        success: 'border-transparent bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800',
        warning: 'border-transparent bg-yellow-600 text-white hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={clsx(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };