import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, ReactNode } from 'react';

const footerVariants = cva(
  'absolute bottom-0 min-h-1/18 w-full rounded-tl-lg rounded-tr-lg p-2 -z-10',
  {
    variants: {
      variant: {
        default: 'bg-amber-500 text-white',
        destructive:
          'bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500/50',
        outline:
          'border border-gray-200 bg-white shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-750',
        secondary:
          'bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
        ghost: 'bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800',
        link: 'bg-transparent text-blue-600 hover:underline underline-offset-4 dark:text-blue-400',
      },
      size: {
        default: 'h-14',
        sm: 'h-12',
        lg: 'h-16',
        compact: 'h-10 min-h-[40px] p-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface FooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof footerVariants> {
  children: ReactNode;
}

export const Footer = forwardRef<HTMLDivElement, FooterProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(footerVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Footer.displayName = 'Footer';
